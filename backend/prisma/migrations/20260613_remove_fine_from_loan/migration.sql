-- DropColumn fine dari tabel loans
-- Sistem denda moneter dihapus, diganti dengan sistem notifikasi dan catatan non-moneter
ALTER TABLE `loans` DROP COLUMN `fine`;
