# see https://docs.python.org/3/library/resource.html for abbreviations

import resource


def page_size():
    return resource.getpagesize()


def limits():
    def report(kind):
        if not hasattr(resource, kind):
            return None

        return dict(zip(
            ['soft', 'hard'],
            resource.getrlimit(getattr(resource, kind))
        ))

    return {kind: report(kind) for kind in [
        'RLIMIT_CORE',
        'RLIMIT_CPU',
        'RLIMIT_FSIZE',
        'RLIMIT_DATA',
        'RLIMIT_STACK',
        'RLIMIT_RSS',
        'RLIMIT_NPROC',
        'RLIMIT_NOFILE',
        'RLIMIT_OFILE',
        'RLIMIT_MEMLOCK',
        'RLIMIT_VMEM',
        'RLIMIT_AS',
        'RLIMIT_MSGQUEUE',
        'RLIMIT_NICE',
        'RLIMIT_RTPRIO',
        'RLIMIT_RTTIME',
        'RLIMIT_SIGPENDING',
        'RLIMIT_SBSIZE',
        'RLIMIT_SWAP',
        'RLIMIT_NPTS'
    ]}


def usage():
    def report(kind):
        if not hasattr(resource, kind):
            return None

        return dict(zip([
            'ru_utime',
            'ru_stime',
            'ru_maxrss',
            'ru_ixrss',
            'ru_idrss',
            'ru_isrss',
            'ru_minflt',
            'ru_majflt',
            'ru_nswap',
            'ru_inblock',
            'ru_oublock',
            'ru_msgsnd',
            'ru_msgrcv',
            'ru_nsignals',
            'ru_nvcsw',
            'ru_nivcsw',
        ], resource.getrusage(getattr(resource, kind))))

    return {kind: report(kind) for kind in [
        'RUSAGE_SELF',
        'RUSAGE_CHILDREN',
        'RUSAGE_BOTH',
        'RUSAGE_THREAD'
    ]}
