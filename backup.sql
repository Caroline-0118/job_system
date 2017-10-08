-- MySQL dump 10.13  Distrib 5.7.18, for macos10.12 (x86_64)
--
-- Host: localhost    Database: job_system
-- ------------------------------------------------------
-- Server version	5.7.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `em_business`
--

DROP TABLE IF EXISTS `em_business`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `em_business` (
  `b_id` int(11) NOT NULL AUTO_INCREMENT,
  `b_name` varchar(50) DEFAULT NULL,
  `b_address` varchar(50) DEFAULT NULL,
  `b_contactor` varchar(10) DEFAULT NULL,
  `b_contactnum` varchar(50) DEFAULT NULL,
  `b_remark` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`b_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `em_business`
--

LOCK TABLES `em_business` WRITE;
/*!40000 ALTER TABLE `em_business` DISABLE KEYS */;
INSERT INTO `em_business` VALUES (8,'四川绿我健康科技有限公司','成都高新区府城大道中段88号中航城市广场15-06','刘女士','028-61384900',NULL),(9,'绿盟科技成都研发中心','成都高新区科园二路10号航利中心一期2栋2单元14楼','张力','028-61384901',NULL),(10,'成都慧农信息技术有限公司','高新区天府二街138号蜀都中心2号楼','HR','028-61384902',NULL),(11,'成都中辉乾坤文化传媒有限责任公司','高新区天府二街138号蜀都中心2号楼','谭雪','028-61384903',NULL),(12,'四川娟娟家信息科技服务有限公司','成都高新区天府二街138号蜀都中心12楼','赵秀茗','028-61384904',NULL),(13,'乐村淘网络科技有限公司四川分公司','成都高新区天府二街138号2幢1单元18层5号','HR','028-61384905',NULL),(14,'四川联友电讯技术公司','成都市高朋大道11号高新区科技工业园C座4楼','易女士','028-61384906',NULL),(15,'四川神通教育科技有限公司','高新南区天府大道北段1700号环球中心E5-3-2-1009','肖女士','028-61384907',NULL),(16,'四川倍施特科技股份有限公司','高新区天府大道1480号德商国际B座','王经理','18628122369',NULL),(17,'四川拓牛网络','高新区移动互联创业大厦G1-1207','HR','18628122369',NULL),(18,'四川智能视讯信息技术有限公司','高新区中和大道二段二号天益国际9层','HR','18628122369',NULL),(19,'成都数联易康科技有限公司','四川省成都市高新区天府大道中段530号东方希望天祥广场3401','hr','18628122369',NULL),(20,'四川易帘科技有限公司','高新区天府二街138号蜀都中心2号楼','刘小姐','18628122369',NULL),(21,'成都博智维讯信息技术股份有限公司','成都高新区天府二街138号2栋1单元10层6号','HR','18628122369',NULL),(22,'江融信科技','天府三街新希望国际大厦C座2层','陶','18628122369',NULL),(23,'成都掌沃无限科技有限公司','高新区天府二街138号蜀都中心2号楼','王小姐','18628122369',NULL);
/*!40000 ALTER TABLE `em_business` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `em_class`
--

DROP TABLE IF EXISTS `em_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `em_class`
--

LOCK TABLES `em_class` WRITE;
/*!40000 ALTER TABLE `em_class` DISABLE KEYS */;
INSERT INTO `em_class` VALUES (1,'2016机电网络班','冯万忠','刘燕秀','2016-08-01','2016-09-30','国信安西区206','','413978174'),(2,'2016机电电商电艺班','吴晓强、杜孟之','刘燕秀','2016-08-29','2016-10-30','国信安西区211','','413978174'),(3,'2016机电微软班','王宝山','刘燕秀','2016-08-29','2016-10-30','国信安西区205','.NET开发','413978174'),(4,'2016校合运营班','杜孟之','刘燕','2016-08-29','2016-11-01','国信安西区210','','413978174'),(5,'2016校合运维一班208','冯万忠','李娟','2016-08-29','2016-11-01','国信安西区','','413978174'),(6,'2016校合运维二班202','张洪','李娟','2016-08-29','2016-11-07','国信安西区202','','413978174'),(7,'2016校合开发班','李广','刘燕','2016-08-29','2016-11-18','国信安西区201','JAVA开发','413978174'),(8,'2016千星','','梅樱燕','2014-09-01','2016-10-01','国信安西区','','413978174'),(9,'百杰110部JAVA','李厚良','邓胜男','2016-07-01','2016-12-19','国信安南区7栋4教','JAVA开发','413978174'),(10,'百杰113部WEB','刘靖阳','刘娟','2016-09-26','2016-12-28','','','413978174'),(11,'百杰812B部WEB','刘靖阳','王芳','2016-08-15','2016-11-29','4教','百杰108、111、112，三个班合并','413978174'),(12,'百杰107部java','刘阳','邓胜男','2016-07-12','2016-11-24','4教','','413978174'),(13,'百杰105部UI','kevin','黄丹','2016-08-23','2016-12-23','5教','','413978174'),(14,'百杰117部WEB前端','杨阳','黄丹','2016-07-12','2016-12-30','4教','','413978174'),(15,'百杰812A部WEB前端','林艺娜','曾娜','2016-02-16','2016-11-28','3教','百杰108、111、112，三个班合并','413978174'),(24,'百杰133部','洗剪吹','人事经理','2017-03-07','2017-09-01','3B-12','',''),(25,'百杰131部','经理','人事经理','2017-10-02','2017-10-20','4A－04','','');
/*!40000 ALTER TABLE `em_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `em_interview`
--

DROP TABLE IF EXISTS `em_interview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `em_interview`
--

LOCK TABLES `em_interview` WRITE;
/*!40000 ALTER TABLE `em_interview` DISABLE KEYS */;
/*!40000 ALTER TABLE `em_interview` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `em_jobdirection`
--

DROP TABLE IF EXISTS `em_jobdirection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `em_jobdirection` (
  `j_id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `j_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`j_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `em_jobdirection`
--

LOCK TABLES `em_jobdirection` WRITE;
/*!40000 ALTER TABLE `em_jobdirection` DISABLE KEYS */;
INSERT INTO `em_jobdirection` VALUES (1,''),(2,'JAVA'),(3,'WEB前端'),(4,'UI'),(5,'Android'),(6,'.net'),(7,'PHP'),(8,'美工'),(9,'大数据'),(10,'云计算'),(11,'C/C++'),(12,'测试工程师'),(13,'技术支持'),(14,'软件实施'),(15,'网络工程师'),(16,'运维工程师'),(17,'数据库工程师'),(18,'电子商务'),(19,'网络编辑'),(20,'网络推广'),(21,'新媒体运营'),(22,'客服'),(23,'销售'),(24,'行政'),(25,'其他');
/*!40000 ALTER TABLE `em_jobdirection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `em_recommend`
--

DROP TABLE IF EXISTS `em_recommend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `em_recommend`
--

LOCK TABLES `em_recommend` WRITE;
/*!40000 ALTER TABLE `em_recommend` DISABLE KEYS */;
INSERT INTO `em_recommend` VALUES (1,46,2147,'Java工程师',7,'','2016-12-28 10:00:00',0),(2,51,2147,'Java工程师',7,'','2016-12-28 10:00:00',0),(3,47,2147,'Java工程师',7,'','2016-12-28 10:00:00',0),(4,996,1166,'java',8,'','2016-12-28 23:00:00',0),(5,991,1166,'java',8,'','2016-12-28 23:00:00',0),(6,999,1166,'java',8,'','2016-12-28 23:00:00',0),(7,29,2148,'Java工程师',7,'','2016-12-30 11:00:00',0),(8,26,2148,'Java工程师',7,'','2016-12-30 11:00:00',0),(9,997,2148,'Java工程师',7,'','2016-12-30 11:00:00',0),(10,3453,1541,'WEB前端开发',2,'','2017-01-03 16:00:00',0),(11,3397,1541,'WEB前端开发',2,'','2017-01-03 16:00:00',0),(12,3392,1541,'WEB前端开发',2,'','2017-01-03 16:00:00',0),(13,2511,1541,'WEB前端开发',2,'','2017-01-03 16:00:00',0),(15,3349,2149,'JAVA开发',7,'','2017-01-03 16:00:00',0),(16,3336,2149,'JAVA开发',7,'','2017-01-03 16:00:00',0),(17,997,2149,'JAVA开发',7,'','2017-01-03 16:00:00',0),(18,3387,2149,'UI设计',7,'','2017-01-03 04:00:00',0),(19,3373,2149,'UI设计',7,'','2017-01-03 04:00:00',0),(20,4696,2151,'PHP工程师',7,'','2017-01-04 14:30:00',0),(21,4684,2151,'PHP工程师',7,'','2017-01-04 14:30:00',0),(22,4701,2152,'PHP',3,'','2017-01-04 12:00:00',0),(23,4685,2152,'PHP',3,'','2017-01-04 12:00:00',0),(24,4700,2154,'PHP工程师',7,'','2017-02-07 15:40:00',0),(25,4696,2154,'PHP工程师',7,'','2017-02-07 15:40:00',0),(26,4689,2154,'PHP工程师',7,'','2017-02-07 15:40:00',0),(27,4683,2154,'PHP工程师',7,'','2017-02-07 15:40:00',0),(28,4684,2154,'PHP工程师',7,'','2017-02-07 15:40:00',0),(29,3527,2154,'前端工程师',7,'','2017-02-07 15:50:00',0),(30,3196,2154,'前端工程师',7,'','2017-02-07 15:50:00',0),(31,3397,2154,'前端工程师',7,'','2017-02-07 15:50:00',0);
/*!40000 ALTER TABLE `em_recommend` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `em_student`
--

DROP TABLE IF EXISTS `em_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `em_student` (
  `s_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `s_name` varchar(10) DEFAULT NULL COMMENT '学生姓名',
  `s_idcard` char(18) DEFAULT NULL,
  `s_school` varchar(20) DEFAULT NULL,
  `s_major` varchar(20) DEFAULT NULL COMMENT '专业',
  `s_graduation` date DEFAULT NULL,
  `s_education` tinyint(4) DEFAULT '0',
  `s_phone` char(50) DEFAULT NULL COMMENT '手机号码',
  `s_qq` varchar(50) DEFAULT NULL COMMENT 'QQ号码',
  `s_email` varchar(30) DEFAULT NULL COMMENT '邮箱',
  `s_c_id` int(11) DEFAULT NULL COMMENT '班级id',
  `s_j_id` varchar(20) DEFAULT NULL,
  `s_teamnum` char(2) DEFAULT NULL,
  `s_jobstatus` tinyint(4) DEFAULT '1' COMMENT '工作状态，1表示无工作，2表示自主就业，3表示推荐就业，4表示放弃工作，5表示推迟就业，6表示放弃就业',
  `s_jobunit` varchar(50) DEFAULT NULL,
  `s_shixijobpay` int(11) DEFAULT NULL,
  `s_jobpay` int(11) DEFAULT NULL COMMENT '工资',
  `s_skill` tinyint(2) DEFAULT '-1',
  `s_quality` tinyint(2) DEFAULT NULL,
  `s_remark` varchar(100) DEFAULT NULL,
  `s_sex` char(2) DEFAULT NULL,
  `s_english` varchar(20) DEFAULT NULL,
  `s_getjobtime` date DEFAULT NULL,
  `s_u_id` int(11) DEFAULT NULL,
  `s_trueresume` varchar(50) DEFAULT NULL,
  `s_falseresume` varchar(50) DEFAULT NULL,
  `s_avata` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`s_id`),
  KEY `s_c_id` (`s_c_id`),
  CONSTRAINT `em_student_ibfk_1` FOREIGN KEY (`s_c_id`) REFERENCES `em_class` (`c_id`)
) ENGINE=InnoDB AUTO_INCREMENT=165 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `em_student`
--

LOCK TABLES `em_student` WRITE;
/*!40000 ALTER TABLE `em_student` DISABLE KEYS */;
INSERT INTO `em_student` VALUES (1,'向俊楠','','重庆机电','网络','2017-07-01',4,'13808318999','','',1,'25','',3,'艾特士',3500,0,5,5,'','男','','2016-10-14',2,NULL,NULL,NULL),(2,'李超','','重庆机电','网络','2017-07-01',4,'13808318999','','',1,'15','',2,'赛酷尔',2000,0,5,5,'','男','','2016-11-10',0,NULL,NULL,NULL),(3,'徐银双','','重庆机电','网络','2017-07-01',4,'13808318999','','',1,'25','',3,'国信安评测中心',1200,0,6,5,'','男','','2016-10-24',2,NULL,NULL,NULL),(4,'何伟明','','重庆机电','网络','2017-07-01',4,'13808318999','','',1,'13','',3,'赛恩图',2000,0,5,5,'','男','','2016-11-02',5,NULL,NULL,NULL),(5,'谯婷','','重庆机电','网络','2017-07-01',4,'13808318999','','',1,'25','',3,'云镭科技',2000,3500,6,5,'通过云蕾面试10.12去入职','男','','2016-09-30',0,NULL,NULL,NULL),(6,'肖明昊','','重庆机电','网络','2017-07-01',4,'13808318999','','',1,'25','',3,'云镭科技',2000,3500,5,5,'通过云蕾面试10.12去入职','男','','2016-09-30',0,NULL,NULL,NULL),(7,'刘瑶','','重庆机电','网络','2017-07-01',4,'13808318999','','',1,'13','',3,'博彦',2000,0,5,5,'','男','','2016-12-16',3,NULL,NULL,NULL),(8,'李慧玲','510107199308073000','乐山师范学院','计算机科学与技术','2014-07-01',6,'13808318999','574867043','',58,'25','',3,'',0,0,-1,5,'','女','',NULL,0,NULL,NULL,NULL),(9,'刘沐岭','510625199802097000','什邡职中','计算机','2014-07-01',3,'13808318999','641529952','',58,'25','',3,'',0,0,-1,4,'','男','',NULL,0,NULL,NULL,NULL),(10,'冯艳秋','511521199308285000','西华大学','计算机科学与技术','2014-07-01',6,'13808318999','904537896','',58,'25','',3,'',0,0,-1,4,'','女','',NULL,0,NULL,NULL,NULL),(162,'Caroline',NULL,'西南科技大学','英语','2016-07-07',6,'18280278283',NULL,NULL,24,NULL,NULL,1,NULL,NULL,NULL,-1,NULL,'','女',NULL,NULL,NULL,NULL,NULL,NULL),(163,'4B班学生',NULL,'重庆大学','酒店管理','2017-09-06',6,'13199999999',NULL,NULL,24,NULL,NULL,2,NULL,NULL,NULL,-1,NULL,'','男',NULL,NULL,NULL,NULL,NULL,NULL),(164,'lansezhaji',NULL,'chengli','dianlu','2016-06-14',8,'18780076215',NULL,NULL,24,NULL,NULL,3,NULL,NULL,NULL,-1,NULL,'','男',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `em_student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `em_user`
--

DROP TABLE IF EXISTS `em_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `em_user` (
  `u_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `u_name` varchar(10) DEFAULT NULL COMMENT '用户名',
  `u_password` varchar(16) DEFAULT NULL COMMENT '用户密码',
  `u_stutas` varchar(5) DEFAULT NULL COMMENT '用户状态',
  `u_type` varchar(5) DEFAULT '03' COMMENT '用户类型，01超级管理员，02管理者，03普通用户，04人事专员，05推荐人用户',
  `logic_delete_flag` int(2) DEFAULT '0' COMMENT '逻辑删除标志，0表示正常，1表示删除',
  PRIMARY KEY (`u_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `em_user`
--

LOCK TABLES `em_user` WRITE;
/*!40000 ALTER TABLE `em_user` DISABLE KEYS */;
INSERT INTO `em_user` VALUES (1,'admin','111111','0','03',0),(2,'李汝龙','111111','1','03',0),(3,'谢新梅','111111','1','03',0),(4,'李婷','111111','1','03',0),(5,'杨筱砾','chanjia-15496131','2','03',0),(6,'高悦','111111','1','03',0),(7,'方元','111111','1','03',0),(8,'曹杨婷','wuxiao-26762316','2','03',0),(9,'李意','wuxiao-sgsgsgsdg','2','03',0),(10,'郭佳慧','111111','3','03',0),(11,'其他推荐人','wuxiao-14684542','1','03',0),(12,'','123456789','4','03',0),(13,'nana','111111','0','03',0),(14,'周英培','111111','1','03',0),(15,'冯诗航','111111','3','03',0),(18,'lansezhaji','123456','1','03',0),(19,'Caroline','123456','3','03',0);
/*!40000 ALTER TABLE `em_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `em_visited`
--

DROP TABLE IF EXISTS `em_visited`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `em_visited`
--

LOCK TABLES `em_visited` WRITE;
/*!40000 ALTER TABLE `em_visited` DISABLE KEYS */;
INSERT INTO `em_visited` VALUES (1,'2016-12-29 11:13:20','推迟就业',1008,4,'1',NULL),(2,'2016-12-30 15:49:15','目前更新：贝凯诺机箱厂  普工  薪资：2500',1086,9,'1',NULL),(3,'2016-12-30 16:02:16','换工作：百度科技   销售  薪资：2500',1069,9,'1',NULL),(4,'2017-01-03 15:51:16','安美勤考核没通过，需要年后再就业',1052,9,'1',NULL),(5,'2017-01-03 15:55:54','安美勤考核没通过，年后再自主就业',93,9,'1',NULL),(6,'2017-01-04 15:52:43','2016.12.04换工作	四川泛美世纪科技有限公司	网站编辑		薪资：2000',106,9,'1',NULL),(7,'2017-01-04 15:57:40','现已离职',126,9,'1',NULL),(8,'2017-01-04 16:06:34','后离职，回校专升本',164,9,'1',NULL);
/*!40000 ALTER TABLE `em_visited` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-10-08 10:43:58
