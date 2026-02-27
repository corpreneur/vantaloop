CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`registerItemId` int NOT NULL,
	`authorName` varchar(255) NOT NULL,
	`authorTeam` enum('Vanta','Metalab') NOT NULL,
	`text` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intake_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submitterName` varchar(255) NOT NULL,
	`channel` enum('web','sms') NOT NULL,
	`phoneNumber` varchar(20),
	`feedbackType` enum('concept-direction','information-architecture','interaction-pattern','visual-design','copy-content','general') NOT NULL DEFAULT 'general',
	`subject` varchar(500) NOT NULL,
	`goalOfShare` text,
	`whatsWorking` text,
	`questionsRisks` text,
	`suggestions` text,
	`decisionNeeded` text,
	`status` enum('new','under-review','promoted','dismissed') NOT NULL DEFAULT 'new',
	`triagedBy` varchar(255),
	`triagedAt` timestamp,
	`triageNotes` text,
	`weekId` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `intake_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `register_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`intakeItemId` int,
	`title` varchar(500) NOT NULL,
	`epicId` varchar(20),
	`priority` enum('P0','P1','P2','P3') NOT NULL DEFAULT 'P2',
	`feedbackType` enum('concept-direction','information-architecture','interaction-pattern','visual-design','copy-content','general') NOT NULL DEFAULT 'general',
	`columnStatus` enum('backlog','in-progress','resolved','archived') NOT NULL DEFAULT 'backlog',
	`assignee` varchar(255),
	`goalOfShare` text,
	`whatsWorking` text,
	`questionsRisks` text,
	`suggestions` text,
	`decisionNeeded` text,
	`decision` text,
	`decisionRationale` text,
	`promotedBy` varchar(255),
	`promotedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `register_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sms_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`currentStep` enum('awaiting-name','awaiting-subject','awaiting-type','awaiting-goal','awaiting-working','awaiting-risks','awaiting-suggestions','awaiting-decision','complete') NOT NULL DEFAULT 'awaiting-name',
	`partialData` json,
	`finalized` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sms_conversations_id` PRIMARY KEY(`id`)
);
