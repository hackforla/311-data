def get_correct_column_count(file_path):
    with open(file_path, "r") as file:
        header = file.readline().strip()
        return len(header.split(','))

correct_columns = get_correct_column_count("2022.csv")
print(f"Correct number of columns: {correct_columns}")
