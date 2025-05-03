PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_complaints` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_complaints`("id", "description") SELECT "id", "description" FROM `complaints`;--> statement-breakpoint
DROP TABLE `complaints`;--> statement-breakpoint
ALTER TABLE `__new_complaints` RENAME TO `complaints`;--> statement-breakpoint
PRAGMA foreign_keys=ON;