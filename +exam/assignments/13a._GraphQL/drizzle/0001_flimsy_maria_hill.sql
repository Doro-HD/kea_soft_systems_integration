PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_authors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text
);
--> statement-breakpoint
INSERT INTO `__new_authors`("id", "name") SELECT "id", "name" FROM `authors`;--> statement-breakpoint
DROP TABLE `authors`;--> statement-breakpoint
ALTER TABLE `__new_authors` RENAME TO `authors`;--> statement-breakpoint
PRAGMA foreign_keys=ON;