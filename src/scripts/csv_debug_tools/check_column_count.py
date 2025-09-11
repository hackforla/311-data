"""
This script provides functions to check the number of columns in a CSV file.
- `get_correct_column_count(file_path)`: Determines the number of columns based on the header row of the CSV.
- `check_row_column_counts(file_path)`: Checks each row in the CSV to ensure it matches the column count of the header.

Usage:

Execute in terminal with python with script name, csv file to execute, flag to execute (header-count or row-check):
  "python3 script_name file_name flag-command"
Note: make sure script and csv are in the same folder or define correct file path

- To get the correct column count from the header, run in terminal:
  example command: `python3 check_column_count.py 2021.csv header-count`

- To check if each row has the correct number of columns:
  example command: `python3 check_column_count.py 2021.csv row-check`
"""

import csv
import sys

def get_correct_column_count(file_path):
    """
    Determine the number of columns based on the header row of the CSV.
    """
    with open(file_path, "r") as file:
        header = file.readline().strip()
        return len(header.split(','))


def check_row_column_counts(file_path):
    """
    Check each row in the CSV to ensure it matches the column count of the header.
    """
    correct_columns = get_correct_column_count(file_path)
    incorrect_rows = []

    with open(file_path, "r") as file:
        reader = csv.reader(file)
        header = next(reader)  # Skip the header row
        for line_number, row in enumerate(reader, start=2):  # Start at 2 to account for the header row
            if len(row) != correct_columns:
                incorrect_rows.append((line_number, len(row)))

    if incorrect_rows:
        print(f"Found rows with incorrect number of columns:")
        for line_number, column_count in incorrect_rows:
            print(f"Line {line_number} has {column_count} columns instead of {correct_columns}")
    else:
        print("All rows have the correct number of columns.")


if __name__ == "__main__":

    # Provide instructions if not enough args passed to the script
    if len(sys.argv) < 3:
        print("Usage: python script_name.py <file_path> <command>")
        print("Commands: header-count, row-check")
        sys.exit(1)

    file_path = sys.argv[1]
    command = sys.argv[2]

    # Flags definition
    if command == "header-count":
        correct_columns = get_correct_column_count(file_path)
        print(f"Correct number of columns: {correct_columns}")
    elif command == "row-check":
        check_row_column_counts(file_path)
    else:
        print("Unknown command. Use 'header-count' or 'row-check'.")
