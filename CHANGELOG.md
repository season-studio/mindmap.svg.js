# Change Log

All notable changes to the "mindmap.svg.js" will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.4] - 2023-02-19

### Changed

- Fix the bug that user can not select text in editor box by mouse.
- Fix the incorrect tip when some exception raised in keydown event.
- Change the default margin value of the topics.
- Change the storage of the customer configuration's logger.

### Added

- Add the backgound color into the configuration of the environment.

## [1.0.3] - 2022-10-19

### Changed

- Add a argument to method "saveDocument" and "getThumbImage" and "exportImage" to special if the event "topic-event-cancel-edit" should not be fired during the action
- Fix the bug the the width and height returned by getXXXRect of the topic may be incorrect when the graphic of the topic is no filling to the full of the box

## [1.0.2] - 2022-09-10

### Added

- Enable customize the shape of the topic box

### Changed

- Enhance compatibility in Safari

## [Unreleased]

- Initial release