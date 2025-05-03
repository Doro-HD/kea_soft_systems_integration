PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_complaints_user_association` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`complaint_id` text NOT NULL,
	`association_kind` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_complaints_user_association`("id", "user_id", "complaint_id", "association_kind") SELECT "id", "user_id", "complaint_id", "association_kind" FROM `complaints_user_association`;--> statement-breakpoint
DROP TABLE `complaints_user_association`;--> statement-breakpoint
ALTER TABLE `__new_complaints_user_association` RENAME TO `complaints_user_association`;--> statement-breakpoint
PRAGMA foreign_keys=ON;