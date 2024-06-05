def find_problematic_line(file_path, num_lines=5):
    with open(file_path, "r") as file:
        for line_number, line in enumerate(file, start=1):
            columns = line.strip().split(',')
            if len(columns) != 34:
                print(f"Problematic line {line_number}: {line.strip()}")

find_problematic_line("2021-fixed.csv")
