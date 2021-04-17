CREATE TABLE `patients` (
  `_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `information` varchar(150) NOT NULL,
  `postedBy` varchar(50) NOT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB;

CREATE TABLE `records` (
  `_id` int unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` int unsigned NOT NULL,
  `title` varchar(30) NOT NULL,
  `body` varchar(150) NOT NULL,
  `postedBy` varchar(50) NOT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` varchar(30) NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB;

CREATE TABLE `users` (
  `_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` char(128) NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` varchar(30) NOT NULL DEFAULT 'subscriber',
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB;

