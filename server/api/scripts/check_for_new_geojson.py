import glob
import os
import requests
from datetime import datetime
from os.path import join, dirname
import filecmp
import json


NC_GEO_JSON_URL = "https://data.lacity.org/api/geospatial/fu65-dz2f?method=export&format=GeoJSON"  # noqa

DATA_FOLDER = join(dirname(__file__), 'data')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 \
        (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
}


def compare_lines(f1, f2):
    i = 0
    changed_lines = []
    with open(f1, 'r') as file1:
        with open(f2, 'r') as file2:
            for line1, line2 in zip(file1, file2):
                i += 1
                if line1 != line2:
                    changed_str = f"{(str(i)+':').ljust(8, ' ')} [-] {line1.strip().ljust(50, ' ')}  [+] {line2.strip()}"  # noqa
                    changed_lines.append(changed_str)
                    print(changed_str)
    return changed_lines


def process_geojson(geojson):
    feature_list = []
    for feature in geojson['features']:
        feature_list.append(feature)

    return {
        "type": "FeatureCollection",
        "features": feature_list
    }


if __name__ == '__main__':

    # download the newer version of the file
    response = requests.get(NC_GEO_JSON_URL, headers=HEADERS, allow_redirects=True)
    geojson = process_geojson(json.loads(response.text))

    # get the previous version of the file
    list_of_files = glob.glob(join(DATA_FOLDER, "nc-boundary-geojson-*.json"))
    prev_file = max(list_of_files)

    # create the new version of the file
    new_file_name = f"nc-boundary-geojson-{datetime.today().strftime('%Y-%m-%d')}.json"
    new_file = join(DATA_FOLDER, new_file_name)

    change_file_name = f"boundary-changes-{datetime.today().strftime('%Y-%m-%d')}.txt"
    change_file = join(DATA_FOLDER, change_file_name)

    # with open(prev_file, 'r') as f:
    #     file_str = json.loads(f.read())
    #     geojson = process_geojson(file_str)

    #     with open(prev_file_write, 'w', encoding='utf-8') as f:
    #         json.dump(geojson, f, indent=4, ensure_ascii=False)

    with open(new_file, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, indent=4, ensure_ascii=False)

    files_equal = filecmp.cmp(
        join(new_file),
        join(prev_file),
        shallow=False
    )

    if files_equal:
        print(f"\n{prev_file}\n ...is the same as new file: \n{new_file}\n")
        os.remove(new_file)
        print(f"Removed {new_file}")

    else:
        print(f"\n{prev_file}\n ...is NOT the same as new file: \n{new_file}\n")

        with open(join(change_file), 'w', encoding='utf-8') as f:
            for line in compare_lines(prev_file, new_file):
                f.write("%s\n" % line)
