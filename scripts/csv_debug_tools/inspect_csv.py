"""
Find and print problematic lines in a CSV file that do not match the expected number of columns.

Parameters:
- file_path: The path to the CSV file.
- expected_columns: The expected number of columns in each row.
- num_lines: The number of problematic lines to print.

Example commmand: `python3 inspect_csv.py 2021.csv 34 5`
"""

import sys

def find_problematic_line(file_path, expected_columns=34, num_lines=5):
    problematic_lines = []

    with open(file_path, "r") as file:
        for line_number, line in enumerate(file, start=1):
            columns = line.strip().split(',')
            if len(columns) != expected_columns:
                problematic_lines.append((line_number, line.strip()))
                if len(problematic_lines) >= num_lines:
                    break

    if problematic_lines:
        print(f"First {num_lines} problematic lines found:")
        for line_number, line in problematic_lines:
            print(f"Problematic line {line_number}: {line}")
    else:
        print("No problematic lines found.")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python check_problematic_lines.py <file_path> <expected_columns> <num_lines>")
        sys.exit(1)

    file_path = sys.argv[1]
    expected_columns = int(sys.argv[2])
    num_lines = int(sys.argv[3])

    find_problematic_line(file_path, expected_columns, num_lines)
