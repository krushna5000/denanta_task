CREATE TABLE "cost_center" (
	"id" serial PRIMARY KEY NOT NULL,
	"plant_id" integer,
	"dep_id" integer,
	"cost_center_name" varchar(255) NOT NULL,
	"cost_center_code" varchar(255),
	"description" text,
	CONSTRAINT "cost_center_cost_center_code_unique" UNIQUE("cost_center_code")
);
--> statement-breakpoint
CREATE TABLE "department" (
	"id" serial PRIMARY KEY NOT NULL,
	"plant_id" integer,
	"dep_name" varchar(255) NOT NULL,
	"dep_code" varchar(255),
	"dep_description" text,
	CONSTRAINT "department_dep_code_unique" UNIQUE("dep_code")
);
--> statement-breakpoint
CREATE TABLE "plant" (
	"id" serial PRIMARY KEY NOT NULL,
	"plant_name" varchar NOT NULL,
	"plant_location" varchar,
	"plant_code" varchar,
	"description" text,
	CONSTRAINT "plant_plant_code_unique" UNIQUE("plant_code")
);
--> statement-breakpoint
CREATE TABLE "work_center" (
	"id" serial PRIMARY KEY NOT NULL,
	"plant_id" integer,
	"dep_id" integer,
	"cost_center_id" integer,
	"work_name" varchar(255) NOT NULL,
	"work_code" varchar(255),
	"work_description" text,
	CONSTRAINT "work_center_work_code_unique" UNIQUE("work_code")
);
--> statement-breakpoint
ALTER TABLE "cost_center" ADD CONSTRAINT "cost_center_plant_id_plant_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cost_center" ADD CONSTRAINT "cost_center_dep_id_department_id_fk" FOREIGN KEY ("dep_id") REFERENCES "public"."department"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "department" ADD CONSTRAINT "department_plant_id_plant_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_center" ADD CONSTRAINT "work_center_plant_id_plant_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_center" ADD CONSTRAINT "work_center_dep_id_department_id_fk" FOREIGN KEY ("dep_id") REFERENCES "public"."department"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_center" ADD CONSTRAINT "work_center_cost_center_id_cost_center_id_fk" FOREIGN KEY ("cost_center_id") REFERENCES "public"."cost_center"("id") ON DELETE no action ON UPDATE no action;