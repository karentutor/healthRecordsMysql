# healthRecords
# healthRecords
# healthRecords
# healthRecords
# healthRecordsMysql
# healthRecordsMysql
# CREATE THE FOLLOWING TWO TABLES 

CREATE TABLE `users` (
  `_id` int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(50) NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` varchar(30) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE `records` (
_id INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30) NOT NULL,
body VARCHAR(150) NOT NULL,
postedBy VARCHAR(50) NOT NULL,
created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
role VARCHAR(30) NOT NULL
);
