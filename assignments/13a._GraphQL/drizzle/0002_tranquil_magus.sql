CREATE TABLE `complaints_user_association` (
	`id` text PRIMARY KEY NOT NULL,
	`complainant_id` text NOT NULL,
	`complainee_id` text NOT NULL,
	FOREIGN KEY (`complainant_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`complainee_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
