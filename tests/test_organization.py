import pathlib

from src.organizer import organize_folders

disorganized_files: list[str] = [
    "Evangelion E1.mp4",
    "Evangelion E3.mp4",
    "Kimetsu no Yaiba S1E1.mp4",
    "Kimetsu no Yaiba S1E3.mp4",
    "Kimetsu no Yaiba S2E2.mp4",
    "Kimetsu no Yaiba 2x4.mp4",
    "Evangelion E2.mp4",
    "Evangelion E4.mp4",
    "Kimetsu no Yaiba S1E2.mp4",
    "Kimetsu no Yaiba S2E1.mp4",
    "Kimetsu no Yaiba S2x3.mp4",
    "Akira.mp4",
]


def setup_test_folder(tmp_path: pathlib.Path):
    """
    Clears 'tmp' folder then creates fake files to be organized inside of it
    """
    if tmp_path.exists():
        for file in tmp_path.iterdir():
            file.unlink()

    tmp_path.mkdir(parents=True, exist_ok=True)

    for file in disorganized_files:
        (tmp_path / file).touch()


def test_organization(tmp_path: pathlib.Path):
    setup_test_folder(tmp_path)

    organize_folders(tmp_path)

    assert (tmp_path / "Evangelion" / "Evangelion E1.mp4").exists()
    assert (tmp_path / "Evangelion" / "Evangelion E2.mp4").exists()
    assert (tmp_path / "Kimetsu no Yaiba" / "Season 1" / "Kimetsu no Yaiba S1E1.mp4").exists()
    assert (tmp_path / "Kimetsu no Yaiba" / "Season 1" / "Kimetsu no Yaiba S1E2.mp4").exists()
    assert (tmp_path / "Kimetsu no Yaiba" / "Season 2" / "Kimetsu no Yaiba S2E1.mp4").exists()
    assert (tmp_path / "Akira.mp4").exists()
