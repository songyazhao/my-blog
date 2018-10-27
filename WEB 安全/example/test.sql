/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MariaDB
 Source Server Version : 100308
 Source Host           : localhost:3306
 Source Schema         : test

 Target Server Type    : MariaDB
 Target Server Version : 100308
 File Encoding         : 65001

 Date: 30/08/2018 14:34:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for posts
-- ----------------------------
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
