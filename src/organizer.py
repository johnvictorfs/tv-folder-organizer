import pathlib
from dataclasses import dataclass

import guessit

# TODO: Especials?


@dataclass
class ShowEpisode:
    episode_file: pathlib.Path
    episode_number: int | None = None
    container: str | None = None

    def move_episode_file(self, show_path: pathlib.Path, title: str | None = None):
        if self.episode_number and title:
            episode_path = show_path / f"{title}E{self.episode_number}"

            if self.container:
                episode_path = episode_path.with_suffix(f".{self.container}")

            if not episode_path.exists():
                self.episode_file.rename(episode_path)
        else:
            episode_path = show_path

            if self.container:
                episode_path = episode_path.with_suffix(f".{self.container}")

            self.episode_file.rename(episode_path)


@dataclass
class ShowSeason:
    season_number: int
    episodes: list[ShowEpisode]

    def setup_season_folder(self, show_path: pathlib.Path):
        season_path = show_path / f"Season {self.season_number}"

        if not season_path.exists():
            season_path.mkdir()

        for episode in self.episodes:
            episode.move_episode_file(season_path, f"{show_path.name} S{self.season_number}")


@dataclass
class Show:
    title: str
    seasons: list[ShowSeason]
    standalone_episodes: list[ShowEpisode]
    standalone_single_episode: ShowEpisode | None = None

    def find_season(self, season_number: int) -> ShowSeason | None:
        for season in self.seasons:
            if season.season_number == season_number:
                return season

        return None

    def setup_show_folder(self, path: pathlib.Path):
        show_path = path / self.title

        if not show_path.exists() and (self.seasons or self.standalone_episodes):
            show_path.mkdir()

        for season in self.seasons:
            season.setup_season_folder(show_path)

        for episode in self.standalone_episodes:
            episode.move_episode_file(show_path, f"{self.title} ")

        if self.standalone_single_episode:
            self.standalone_single_episode.move_episode_file(show_path)


def generate_directory_tree(path: pathlib.Path):
    directory_tree: dict[str, Show] = {}

    for file in path.iterdir():
        if not file.is_file():
            continue

        guess = guessit.guessit(file.name)

        show_episode = ShowEpisode(
            episode_file=file, episode_number=guess.get("episode"), container=guess.get("container")
        )

        if directory_tree.get(guess["title"]) is None:
            directory_tree[guess["title"]] = Show(
                title=guess["title"], seasons=[], standalone_episodes=[]
            )

        season = guess.get("season")

        if season:
            Show_season = directory_tree[guess["title"]].find_season(guess.get("season"))

            if Show_season:
                Show_season.episodes.append(show_episode)
            else:
                directory_tree[guess["title"]].seasons.append(
                    ShowSeason(
                        season_number=guess.get("season"),
                        episodes=[show_episode],
                    )
                )
        elif show_episode.episode_number:
            directory_tree[guess["title"]].standalone_episodes.append(show_episode)
        else:
            # Single "episode" shows, like movies or specials
            directory_tree[guess["title"]].standalone_single_episode = show_episode

    return directory_tree


def organize_folders(path: pathlib.Path):
    print(generate_directory_tree(path))

    for show in generate_directory_tree(path).values():
        show.setup_show_folder(path)
