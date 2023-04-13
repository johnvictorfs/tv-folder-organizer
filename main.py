import pathlib

from src.organizer import organize_folders

if __name__ == "__main__":
    # TODO CLI args
    organize_folders(pathlib.Path("tmp"))
