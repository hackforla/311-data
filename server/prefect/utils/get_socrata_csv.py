"""Gets data from a certain date range from Socrata as a csv file.

Example command:
pipenv run python -m utils.get_socrata_csv --start_date=2022-06-10 --end_date=2022-06-11 --output_dir=test
pipenv run python -m utils.get_socrata_csv --start_date=2022-06-24 --end_date=2022-06-25 --output_dir=test

"""

from datetime import datetime

from absl import app
from absl import flags

from tasks import socrata

FLAGS = flags.FLAGS

flags.DEFINE_string("start_date", None, "The start date (inclusive) for Socrata data.")
flags.DEFINE_string("end_date", None, "The end date (exclusive) for Socrata data.")
flags.DEFINE_string("output_dir", None, "The output path for the csv file.")


def main(unused_argv):
    del unused_argv
    output_basename = socrata.download_dataset.run("i5ke-k6by",
        datetime.fromisoformat(FLAGS.start_date),
        datetime.fromisoformat(FLAGS.end_date),
        output_dir=FLAGS.output_dir)
    print("Wrote to ", output_basename)


if __name__ == "__main__":
    app.run(main)
