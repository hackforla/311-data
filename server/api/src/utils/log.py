from textwrap import dedent as dedenter


class log_colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def log(message='', color=None, dedent=False):
    if dedent:
        message = dedenter(message)

    lines = message.split('\n')
    for line in lines:
        if color is not None:
            line = color + line + log_colors.ENDC
        print(line, flush=True)


def bar(chars, width):
    return ''.join([chars[idx % len(chars)] for idx in range(width)])


def log_heading(heading, spacing=(1, 1), style='thin'):
    width = 60
    char = ':' if style == 'thick' else '='

    heading_width = len(heading) + 2
    first = (width - heading_width) // 2
    last = width - first - heading_width

    heading = (
        f"| {bar(char, first)} {heading.upper()} {bar(char, last)} |"
        if style == 'thick' else
        f"{bar(char, first)} {heading.upper()} {bar(char, last)}")

    for space in range(spacing[0]):
        log()
    if style == 'thick':
        log(f"o {bar('-', width)} o")
    log(heading)
    if style == 'thick':
        log(f"o {bar('-', width)} o")
    for space in range(spacing[1]):
        log()
