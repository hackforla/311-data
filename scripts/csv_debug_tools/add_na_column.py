'''
This script is for adding 'N/A' values to the 8th column 'CreatedByUserOrganization'
Due to 2021 data missing values in that entire column, which shifted all columns
after it forward
Saving this for future similar situation
'''

import csv

input_file = "2021.csv"
output_file = "2021_with_na.csv"

with open(input_file, "r", newline='', encoding='utf-8') as infile, open(output_file, "w", newline='', encoding='utf-8') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)

    # Read the header
    header = next(reader)
    writer.writerow(header)

    for line_number, row in enumerate(reader, start=2):
        # Ensure row has the correct length by adding 'N/A' to the 8th column if necessary
        if len(row) != len(header):
            if len(row) == len(header) - 1:
                row.insert(8, 'N/A')
            else:
                print(f"Line {line_number} has an incorrect number of columns: {len(row)} instead of {len(header)}")
        writer.writerow(row)

print(f"Processed {input_file} and saved to {output_file}")
