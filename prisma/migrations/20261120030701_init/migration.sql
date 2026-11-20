-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMINISTRATOR', 'PELATIH');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('AKTIF', 'NONAKTIF');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('BELUM_LENGKAP', 'TERVERIFIKASI');

-- CreateEnum
CREATE TYPE "AgeGroupStatus" AS ENUM ('AKTIF', 'NONAKTIF');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('HADIR', 'ALPA');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('DRAFT', 'FINAL');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('KIPER', 'BELAKANG', 'TENGAH', 'DEPAN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coach" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "placeOfBirth" TEXT,
    "dateOfBirth" DATE,
    "address" TEXT,
    "license" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "nis" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "placeOfBirth" TEXT,
    "dateOfBirth" DATE,
    "address" TEXT,
    "joinDate" DATE,
    "status" "StudentStatus" NOT NULL DEFAULT 'AKTIF',
    "profilePhoto" TEXT,
    "parentName" TEXT,
    "phone" TEXT,
    "position" "Position",
    "ageGroupId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("nis")
);

-- CreateTable
CREATE TABLE "StudentDocument" (
    "id" SERIAL NOT NULL,
    "nis" TEXT NOT NULL,
    "registrationForm" TEXT,
    "familyCard" TEXT,
    "birthCertificate" TEXT,
    "pasPhoto" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'BELUM_LENGKAP',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgeGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "AgeGroupStatus" NOT NULL DEFAULT 'AKTIF',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgeGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Academic" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "periodeStart" DATE NOT NULL,
    "periodeEnd" DATE NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Academic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSession" (
    "id" SERIAL NOT NULL,
    "ageGroupId" INTEGER NOT NULL,
    "academicId" INTEGER NOT NULL,
    "coachId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "trainingSessionId" INTEGER NOT NULL,
    "nis" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportCard" (
    "id" SERIAL NOT NULL,
    "nis" TEXT NOT NULL,
    "ageGroupId" INTEGER NOT NULL,
    "academicId" INTEGER NOT NULL,
    "coachId" INTEGER NOT NULL,
    "totalScore" DECIMAL(5,2),
    "notes" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportCardDetail" (
    "id" SERIAL NOT NULL,
    "reportCardId" INTEGER NOT NULL,
    "assessmentAspectId" INTEGER NOT NULL,
    "score" DECIMAL(5,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportCardDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentAspect" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentAspect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_userId_key" ON "Coach"("userId");

-- CreateIndex
CREATE INDEX "Student_ageGroupId_idx" ON "Student"("ageGroupId");

-- CreateIndex
CREATE INDEX "StudentDocument_nis_idx" ON "StudentDocument"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "AgeGroup_name_key" ON "AgeGroup"("name");

-- CreateIndex
CREATE INDEX "TrainingSession_ageGroupId_idx" ON "TrainingSession"("ageGroupId");

-- CreateIndex
CREATE INDEX "TrainingSession_academicId_idx" ON "TrainingSession"("academicId");

-- CreateIndex
CREATE INDEX "TrainingSession_coachId_idx" ON "TrainingSession"("coachId");

-- CreateIndex
CREATE INDEX "TrainingSession_date_idx" ON "TrainingSession"("date");

-- CreateIndex
CREATE INDEX "Attendance_nis_idx" ON "Attendance"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_trainingSessionId_nis_key" ON "Attendance"("trainingSessionId", "nis");

-- CreateIndex
CREATE INDEX "ReportCard_ageGroupId_idx" ON "ReportCard"("ageGroupId");

-- CreateIndex
CREATE INDEX "ReportCard_academicId_idx" ON "ReportCard"("academicId");

-- CreateIndex
CREATE INDEX "ReportCard_coachId_idx" ON "ReportCard"("coachId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportCard_nis_academicId_key" ON "ReportCard"("nis", "academicId");

-- CreateIndex
CREATE INDEX "ReportCardDetail_assessmentAspectId_idx" ON "ReportCardDetail"("assessmentAspectId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportCardDetail_reportCardId_assessmentAspectId_key" ON "ReportCardDetail"("reportCardId", "assessmentAspectId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coach" ADD CONSTRAINT "Coach_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_ageGroupId_fkey" FOREIGN KEY ("ageGroupId") REFERENCES "AgeGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDocument" ADD CONSTRAINT "StudentDocument_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Student"("nis") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSession" ADD CONSTRAINT "TrainingSession_ageGroupId_fkey" FOREIGN KEY ("ageGroupId") REFERENCES "AgeGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSession" ADD CONSTRAINT "TrainingSession_academicId_fkey" FOREIGN KEY ("academicId") REFERENCES "Academic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSession" ADD CONSTRAINT "TrainingSession_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_trainingSessionId_fkey" FOREIGN KEY ("trainingSessionId") REFERENCES "TrainingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Student"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportCard" ADD CONSTRAINT "ReportCard_nis_fkey" FOREIGN KEY ("nis") REFERENCES "Student"("nis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportCard" ADD CONSTRAINT "ReportCard_ageGroupId_fkey" FOREIGN KEY ("ageGroupId") REFERENCES "AgeGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportCard" ADD CONSTRAINT "ReportCard_academicId_fkey" FOREIGN KEY ("academicId") REFERENCES "Academic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportCard" ADD CONSTRAINT "ReportCard_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportCardDetail" ADD CONSTRAINT "ReportCardDetail_reportCardId_fkey" FOREIGN KEY ("reportCardId") REFERENCES "ReportCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportCardDetail" ADD CONSTRAINT "ReportCardDetail_assessmentAspectId_fkey" FOREIGN KEY ("assessmentAspectId") REFERENCES "AssessmentAspect"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
