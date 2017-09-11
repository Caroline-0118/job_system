/*
Navicat MySQL Data Transfer

Source Server         : lll
Source Server Version : 50627
Source Host           : localhost:3306
Source Database       : employment

Target Server Type    : MYSQL
Target Server Version : 50627
File Encoding         : 65001

Date: 2016-12-26 17:27:14
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for em_business
-- ----------------------------
DROP TABLE IF EXISTS `em_business`;
CREATE TABLE `em_business` (
  `b_id` int(11) NOT NULL AUTO_INCREMENT,
  `b_name` varchar(50) DEFAULT NULL,
  `b_address` varchar(50) DEFAULT NULL,
  `b_contactor` varchar(10) DEFAULT NULL,
  `b_contactnum` varchar(50) DEFAULT NULL,
  `b_remark` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`b_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for em_class
-- ----------------------------
DROP TABLE IF EXISTS `em_class`;
CREATE TABLE `em_class` (
  `c_id` int(11) NOT NULL AUTO_INCREMENT,
  `c_name` varchar(50) DEFAULT NULL,
  `c_manager` varchar(10) DEFAULT NULL,
  `c_hr` varchar(10) DEFAULT NULL,
  `c_begintime` date DEFAULT NULL,
  `c_endtime` date DEFAULT NULL,
  `c_address` varchar(20) DEFAULT NULL,
  `c_remark` varchar(100) DEFAULT NULL,
  `c_qq` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`c_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for em_interview
-- ----------------------------
DROP TABLE IF EXISTS `em_interview`;
CREATE TABLE `em_interview` (
  `i_id` int(11) NOT NULL AUTO_INCREMENT,
  `i_time` datetime DEFAULT NULL,
  `i_b_id` int(11) DEFAULT NULL,
  `i_s_id` int(11) DEFAULT NULL,
  `i_u_id` int(11) DEFAULT NULL,
  `i_address` varchar(50) DEFAULT NULL,
  `i_tel` char(12) DEFAULT NULL,
  `i_writeresult` int(1) DEFAULT NULL,
  `i_faceresult` int(1) DEFAULT NULL,
  `i_retestresult` int(1) DEFAULT NULL,
  `i_entryresult` int(1) DEFAULT NULL,
  `i_remark` varchar(100) DEFAULT NULL,
  `i_employ` int(1) DEFAULT NULL,
  `i_job` varchar(20) DEFAULT NULL,
  `i_addtime` date DEFAULT NULL,
  `i_employtime` date DEFAULT NULL,
  `i_xishijobpay` int(11) DEFAULT NULL,
  `i_jobpay` int(11) DEFAULT NULL,
  PRIMARY KEY (`i_id`),
  KEY `i_b_id` (`i_b_id`),
  KEY `i_u_id` (`i_u_id`),
  KEY `i_s_id` (`i_s_id`),
  CONSTRAINT `em_interview_ibfk_1` FOREIGN KEY (`i_b_id`) REFERENCES `em_business` (`b_id`),
  CONSTRAINT `em_interview_ibfk_2` FOREIGN KEY (`i_u_id`) REFERENCES `em_user` (`u_id`),
  CONSTRAINT `em_interview_ibfk_3` FOREIGN KEY (`i_s_id`) REFERENCES `em_student` (`s_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for em_jobdirection
-- ----------------------------
DROP TABLE IF EXISTS `em_jobdirection`;
CREATE TABLE `em_jobdirection` (
  `j_id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `j_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`j_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for em_recommend
-- ----------------------------
DROP TABLE IF EXISTS `em_recommend`;
CREATE TABLE `em_recommend` (
  `r_id` int(11) NOT NULL AUTO_INCREMENT,
  `r_s_id` int(11) DEFAULT NULL,
  `r_b_id` int(11) DEFAULT NULL,
  `r_job` varchar(20) DEFAULT NULL,
  `r_u_id` int(11) DEFAULT NULL,
  `r_remark` varchar(400) DEFAULT NULL,
  `r_time` datetime DEFAULT NULL,
  `r_stutas` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`r_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for em_student
-- ----------------------------
DROP TABLE IF EXISTS `em_student`;
CREATE TABLE `em_student` (
  `s_id` int(11) NOT NULL AUTO_INCREMENT,
  `s_name` varchar(10) DEFAULT NULL,
  `s_idcard` char(18) DEFAULT NULL,
  `s_school` varchar(20) DEFAULT NULL,
  `s_major` varchar(20) DEFAULT NULL,
  `s_graduation` date DEFAULT NULL,
  `s_education` tinyint(4) DEFAULT '0',
  `s_phone` char(50) DEFAULT NULL,
  `s_qq` varchar(50) DEFAULT NULL,
  `s_email` varchar(30) DEFAULT NULL,
  `s_c_id` int(11) DEFAULT NULL,
  `s_j_id` varchar(20) DEFAULT NULL,
  `s_teamnum` char(2) DEFAULT NULL,
  `s_jobstatus` tinyint(4) DEFAULT '1',
  `s_jobunit` varchar(50) DEFAULT NULL,
  `s_shixijobpay` int(11) DEFAULT NULL,
  `s_jobpay` int(11) DEFAULT NULL,
  `s_skill` tinyint(2) DEFAULT '-1',
  `s_quality` tinyint(2) DEFAULT NULL,
  `s_remark` varchar(100) DEFAULT NULL,
  `s_sex` char(2) DEFAULT NULL,
  `s_english` varchar(20) DEFAULT NULL,
  `s_getjobtime` date DEFAULT NULL,
  `s_u_id` int(11) DEFAULT NULL,
  `s_trueresume` varchar(50) DEFAULT NULL,
  `s_falseresume` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`s_id`),
  KEY `s_c_id` (`s_c_id`),
  CONSTRAINT `em_student_ibfk_1` FOREIGN KEY (`s_c_id`) REFERENCES `em_class` (`c_id`)
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for em_user
-- ----------------------------
DROP TABLE IF EXISTS `em_user`;
CREATE TABLE `em_user` (
  `u_id` int(11) NOT NULL AUTO_INCREMENT,
  `u_name` varchar(10) DEFAULT NULL,
  `u_password` varchar(16) DEFAULT NULL,
  `u_stutas` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`u_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for em_visited
-- ----------------------------
DROP TABLE IF EXISTS `em_visited`;
CREATE TABLE `em_visited` (
  `v_id` int(11) NOT NULL AUTO_INCREMENT,
  `v_time` datetime DEFAULT NULL,
  `v_content` varchar(400) DEFAULT NULL,
  `v_s_id` int(11) DEFAULT NULL,
  `v_u_id` int(11) DEFAULT NULL,
  `v_type` char(1) DEFAULT NULL,
  `v_remark` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`v_id`),
  KEY `v_s_id` (`v_s_id`),
  KEY `v_u_id` (`v_u_id`),
  CONSTRAINT `em_visited_ibfk_1` FOREIGN KEY (`v_s_id`) REFERENCES `em_student` (`s_id`),
  CONSTRAINT `em_visited_ibfk_2` FOREIGN KEY (`v_u_id`) REFERENCES `em_user` (`u_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
