# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 192.168.1.98 (MySQL 5.5.43-log)
# Database: job_system
# Generation Time: 2017-12-16 04:30:28 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table em_business
# ------------------------------------------------------------

DROP TABLE IF EXISTS `em_business`;
CREATE TABLE `em_business` (
  `b_id` int(11) NOT NULL AUTO_INCREMENT,
  `b_name` varchar(50) DEFAULT NULL,
  `b_address` varchar(50) DEFAULT NULL,
  `b_contactor` varchar(10) DEFAULT NULL,
  `b_contactnum` varchar(50) DEFAULT NULL,
  `b_remark` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`b_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2455 DEFAULT CHARSET=utf8;

# Dump of table em_class
# ------------------------------------------------------------

DROP TABLE IF EXISTS `em_class`;
CREATE TABLE `em_class` (
  `c_id` int(11) NOT NULL AUTO_INCREMENT,
  `c_name` varchar(50) DEFAULT NULL,
  `c_manager` varchar(10) DEFAULT NULL,
  `c_hr` varchar(10) DEFAULT NULL,
  `c_begintime` date DEFAULT NULL COMMENT '课程开始时间',
  `c_endtime` date DEFAULT NULL COMMENT '课程结束时间',
  `c_address` varchar(20) DEFAULT NULL,
  `c_remark` varchar(100) DEFAULT NULL,
  `c_qq` varchar(50) DEFAULT NULL,
  `c_status` varchar(8) DEFAULT '00' COMMENT '班级状态，00表示未结班，01表示申请结班中，02表示拒绝结班，11表示已经结班',
  `c_closetime` date DEFAULT NULL COMMENT '结束班级时间，就业率达到100%',
  PRIMARY KEY (`c_id`)
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8;


# Dump of table em_interview
# ------------------------------------------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=1390 DEFAULT CHARSET=utf8;


# Dump of table em_jobdirection
# ------------------------------------------------------------

DROP TABLE IF EXISTS `em_jobdirection`;
CREATE TABLE `em_jobdirection` (
  `j_id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `j_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`j_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

# Dump of table em_message
# ------------------------------------------------------------

DROP TABLE IF EXISTS `em_message`;
CREATE TABLE `em_message` (
  `m_id` int(8) NOT NULL AUTO_INCREMENT COMMENT '消息主键',
  `m_time` date DEFAULT NULL COMMENT '创建消息的时间',
  `m_user` varchar(20) DEFAULT NULL COMMENT '消息发送对象id',
  `m_content` varchar(100) DEFAULT NULL COMMENT '消息内容',
  `m_status` smallint(4) DEFAULT '0' COMMENT '消息状态，0表示未读，1表示已读',
  `m_c_id` int(8) DEFAULT NULL COMMENT '消息对应的班级ID',
  PRIMARY KEY (`m_id`),
  KEY `em_user` (`m_user`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;



# Dump of table em_recommend
# ------------------------------------------------------------

DROP TABLE IF EXISTS `em_recommend`;
CREATE TABLE `em_recommend` (
  `r_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '推荐主ID',
  `r_s_id` int(11) DEFAULT NULL COMMENT '推荐学生ID',
  `r_b_id` int(11) DEFAULT NULL,
  `r_job` varchar(20) DEFAULT NULL COMMENT '推荐工作',
  `r_u_id` int(11) DEFAULT NULL COMMENT '推荐人ID',
  `r_remark` varchar(400) DEFAULT NULL COMMENT '推荐备注',
  `r_time` datetime DEFAULT NULL COMMENT '推荐时间',
  `r_stutas` tinyint(1) DEFAULT '0' COMMENT '推荐结果',
  PRIMARY KEY (`r_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1705 DEFAULT CHARSET=utf8;


# Dump of table em_student
# ------------------------------------------------------------

DROP TABLE IF EXISTS `em_student`;
CREATE TABLE `em_student` (
  `s_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `s_name` varchar(10) DEFAULT NULL COMMENT '学生姓名',
  `s_idcard` char(20) DEFAULT NULL COMMENT '身份证号码',
  `s_school` varchar(20) DEFAULT NULL COMMENT '学校',
  `s_major` varchar(20) DEFAULT NULL COMMENT '专业',
  `s_graduation` date DEFAULT NULL,
  `s_education` tinyint(4) DEFAULT '0' COMMENT '教育程度，1初中，2高中、中专，4专科，6本科，8研究生，9博士',
  `s_phone` char(50) DEFAULT NULL COMMENT '手机号码',
  `s_qq` varchar(50) DEFAULT NULL COMMENT 'QQ号码',
  `s_email` varchar(30) DEFAULT NULL COMMENT '邮箱',
  `s_c_id` int(11) DEFAULT NULL COMMENT '班级id',
  `s_j_id` varchar(20) DEFAULT NULL COMMENT '工作id',
  `s_teamnum` char(2) DEFAULT NULL COMMENT '小组',
  `s_jobstatus` tinyint(4) DEFAULT '1' COMMENT '工作状态，1表示无工作，2表示自主就业，3表示推荐就业，4表示放弃工作，5表示推迟就业，6表示拒绝就业',
  `s_jobunit` varchar(50) DEFAULT NULL,
  `s_shixijobpay` int(11) DEFAULT NULL COMMENT '试用期工资',
  `s_jobpay` int(11) DEFAULT NULL COMMENT '正式工资',
  `s_skill` tinyint(2) DEFAULT '-1' COMMENT '技能',
  `s_quality` tinyint(2) DEFAULT NULL,
  `s_remark` varchar(200) DEFAULT NULL COMMENT '备注',
  `s_sex` char(2) DEFAULT NULL COMMENT '性别',
  `s_english` varchar(20) DEFAULT NULL COMMENT '英语等级',
  `s_getjobtime` date DEFAULT NULL COMMENT '就业时间',
  `s_u_id` int(11) DEFAULT NULL COMMENT '推荐人id',
  `s_trueresume` varchar(50) DEFAULT NULL COMMENT '真实简历',
  `s_falseresume` varchar(50) DEFAULT NULL COMMENT '包装简历',
  `s_avata` varchar(50) DEFAULT NULL COMMENT '头像地址',
  PRIMARY KEY (`s_id`),
  KEY `s_c_id` (`s_c_id`),
  CONSTRAINT `em_student_ibfk_1` FOREIGN KEY (`s_c_id`) REFERENCES `em_class` (`c_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15501 DEFAULT CHARSET=utf8;


# Dump of table em_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `em_user`;
CREATE TABLE `em_user` (
  `u_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `u_name` varchar(10) DEFAULT NULL COMMENT '用户名',
  `u_password` varchar(16) DEFAULT NULL COMMENT '用户密码',
  `u_stutas` varchar(5) DEFAULT NULL COMMENT '用户状态,1在职，2离职',
  `u_type` varchar(5) DEFAULT '03' COMMENT '用户类型，01超级管理员，02管理者，03普通用户，04人事专员，05班主任，06推荐人用户',
  `logic_delete_flag` int(2) DEFAULT '0' COMMENT '逻辑删除标志，0表示正常，1表示删除',
  PRIMARY KEY (`u_id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;


# Dump of table em_visited
# ------------------------------------------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=1371 DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


alter table em_user add file1 varchar(100) ;
alter table em_user add file2 varchar(100) ;
alter table em_user add file3 varchar(100) ;
