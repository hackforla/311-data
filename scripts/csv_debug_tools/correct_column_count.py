def get_correct_column_count(file_path):
    with open(file_path, "r") as file:
        header = file.readline().strip()
        return len(header.split(','))

correct_columns = get_correct_column_count("2022.csv")
print(f"Correct number of columns: {correct_columns}")



# def check_row_column_counts(file_path):
#     correct_columns = get_correct_column_count(file_path)
#     incorrect_rows = []

#     with open(file_path, "r") as file:
#         reader = csv.reader(file)
#         header = next(reader)  # Skip the header row
#         for line_number, row in enumerate(reader, start=2):  # Start at 2 to account for the header row
#             if len(row) != correct_columns:
#                 incorrect_rows.append((line_number, len(row)))

#     return incorrect_rows

# file_path = "2021.csv"
# incorrect_rows = check_row_column_counts(file_path)

# if incorrect_rows:
#     print(f"Found rows with incorrect number of columns:")
#     for line_number, column_count in incorrect_rows:
#         print(f"Line {line_number} has {column_count} columns instead of {correct_columns}")
# else:
#     print("All rows have the correct number of columns.")