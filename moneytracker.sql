-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 25 Bulan Mei 2025 pada 09.24
-- Versi server: 10.4.24-MariaDB
-- Versi PHP: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `moneytracker`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES
(1, 'Gaji', '2025-05-24 12:07:54'),
(2, 'Bonus', '2025-05-24 12:07:54'),
(3, 'Investasi', '2025-05-24 12:07:54'),
(4, 'Penjualan', '2025-05-24 12:07:54'),
(5, 'Hadiah', '2025-05-24 12:07:54'),
(6, 'Makanan', '2025-05-24 12:07:54'),
(7, 'Transportasi', '2025-05-24 12:07:54'),
(8, 'Hiburan', '2025-05-24 12:07:54'),
(9, 'Kesehatan', '2025-05-24 12:07:54'),
(10, 'Belanja', '2025-05-24 12:07:54'),
(11, 'Pendidikan', '2025-05-24 12:07:54'),
(12, 'Tagihan', '2025-05-24 12:07:54'),
(13, 'Donasi', '2025-05-24 12:07:54');

-- --------------------------------------------------------

--
-- Struktur dari tabel `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` varchar(255) NOT NULL,
  `remainingAmount` decimal(15,2) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `plans`
--

INSERT INTO `plans` (`id`, `userId`, `categoryId`, `amount`, `description`, `remainingAmount`, `createdAt`, `updatedAt`) VALUES
(3, 3, 3, '250000.00', 'buat beli kripto', '250000.00', '2025-05-25 13:22:49', '2025-05-25 13:23:06'),
(4, 3, 12, '200000.00', 'indihome', '0.00', '2025-05-25 13:23:23', '2025-05-25 13:24:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date NOT NULL,
  `categoryId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` enum('income','expense') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `transactions`
--

INSERT INTO `transactions` (`id`, `amount`, `description`, `date`, `categoryId`, `userId`, `type`, `created_at`) VALUES
(1, '40000.00', 'dimsum dan siomay', '2025-05-22', 10, 3, 'expense', '2025-05-24 12:36:19'),
(2, '1000000.00', 'gaji bawah umr', '2025-05-23', 1, 3, 'income', '2025-05-24 13:53:30'),
(4, '5000000.00', 'gaji diatas umr', '2025-05-24', 1, 3, 'income', '2025-05-24 14:44:52'),
(5, '30000.00', 'netflix', '2025-05-25', 8, 3, 'expense', '2025-05-24 18:37:05'),
(6, '39999.99', 'beli geprek', '2025-05-25', 10, 3, 'expense', '2025-05-25 05:47:06'),
(7, '19999.97', 'karcis masuk', '2025-05-25', 8, 3, 'expense', '2025-05-25 05:49:01'),
(8, '30000.00', 'naik speadboat', '2025-05-25', 8, 3, 'expense', '2025-05-25 05:56:43'),
(9, '200000.00', 'indihome', '2025-05-25', 12, 3, 'expense', '2025-05-25 06:24:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `password` varchar(255) NOT NULL,
  `foto_profil` mediumblob DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `refresh_token` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `gender`, `password`, `foto_profil`, `created_at`, `refresh_token`) VALUES
(1, 'John Doe', 'john@example.com', 'male', '$2b$10$huUsOcvR8JQL3kuFYlX3oenlz8ktCyBrmK/nDkJsle22xum4j9WBq', NULL, '2025-05-24 10:19:11', NULL),
(2, 'dea', 'd@gmail.com', 'female', '$2b$10$girypGOtYiKsf85K6hMGr.JLV28FBGuc6CTmXyuhlrVBEK7GmxyVO', NULL, '2025-05-24 10:43:43', NULL),
(3, 'naufal', 'naufal@gmail.com', 'male', '$2b$10$Y9TyD81hJ3xPs3RI4i.FKedJfIwxfIusHZ8OD3odiGLFtCWESj4ZO', NULL, '2025-05-24 12:22:23', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indeks untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `userId` (`userId`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `plans`
--
ALTER TABLE `plans`
  ADD CONSTRAINT `plans_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `plans_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
