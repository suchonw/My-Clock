# My-Clock

Web Application

Frontend: JavaScript , React , CSS , Bootstrap
Backend: Node.js , Exprees
Database: MySQL

Project My-Clock จะทำหน้าที่ในการเก็บเวลาเข้าเวลาออก โดยใช้ รหัส ที่ได้จากลงทะเบียนของผู้ใช้ในการบันทึกเวลา

Database 
สร้าง Table 2 Table
1) Table user_info มีหน้าที่เก็บข้อมูลผู้ใช้ระบบ
create table user_info(
	user_id int unique not null auto_increment,
	name varchar(60) unique not null,
	email varchar(60) unique not null,
	passcode varchar(5) unique not null,
	status boolean not null default true
);

2) Table tran_backup มีหน้าเก็บข้อมูลเวลาเข้าและเวลาออก
create table tran_backup(
	tran_id int unique not null auto_increment,
	user_id	int not null,
	clock_in datetime,
	clock_out datetime
);

![db01](https://github.com/suchonw/My-Clock/assets/138205117/9082db9b-2113-4bab-8b12-11087e83dfe3)

Backend : 
npm init |
npm i mysql cors express nodemon nodemailer |
code index.js |

ฝั่ง Backend จะเป็นตัวกลางในการเชื่อมต่อกับ Database และมี API หลัก 3 ตัว
1) http://localhost:3001/add-user จะทำหน้าที่เพิ่มข้อมูลผู้ใช้ลง Database และสร้าง รหัส เพื่อให้ผู้ใช้สามารถใช้ในการลงเวลาได้
2) http://localhost:3001/save-time จะทำหน้าที่ บันทึกเวลาเข้าออกลงใน Database
3) http://localhost:3001/forgot-code จะทำหน้าที่ สร้าง รหัส ใหม่ให้สำหรับผู้ใช้ที่ลืม รหัส และระบบจะส่งรหัสใหม่ไปให้ทาง Email ที่ลงทะเบียนไว้

Frontend : 
npx create-react-app frontend |
npm i react-router-dom |
npm i axios |

ฝั่ง Frontend จะแสดงหน้าเว็บไซต์ให้ผู้ใช้งาน โดยจะมี 3 หน้า
1) Homepage Clock-in Clock-out บันทึกเวลา
2) Register ลงทะเบียนผู้ใช้ใหม่
3) Code recovery ขอ รหัส ใหม่

![fe01](https://github.com/suchonw/My-Clock/assets/138205117/65db19b3-a78e-4d6e-9d5f-9c58ef07db6b)

![fe02](https://github.com/suchonw/My-Clock/assets/138205117/757e7d5f-2529-407c-82a8-2443e2d96ae1)

![fe03](https://github.com/suchonw/My-Clock/assets/138205117/e112ccf2-2e33-4795-93db-1758c04b632a)


