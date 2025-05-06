CREATE TABLE `webhooks` (
	`id` text PRIMARY KEY NOT NULL,
	`event_kind` text NOT NULL,
	`url` text NOT NULL
);
