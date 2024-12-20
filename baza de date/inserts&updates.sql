select * from "ACCOUNTS";
select * from "SAVINGS";
select * from "EXPENSES";
select * from "INCOMES";
select * from "BUDGETS";
select * from "INC_CATEGORIES";
select * from "EXP_CATEGORIES";


----------

UPDATE ""
SET ""=NULL
WHERE "" = ;

--ACCOUNTS
INSERT INTO "ACCOUNTS" ("LAST_NAME", "FIRST_NAME", "PASSWORD", "EMAIL")
VALUES ('Daniel', 'Popescu', 'tort123', 'daniel.popescu@gmail.com');

-- Insert 1
INSERT INTO "ACCOUNTS" ("LAST_NAME", "FIRST_NAME", "PASSWORD", "EMAIL")
VALUES ('Smith', 'John', 'password123', 'john.smith@example.com');

-- Insert 2
INSERT INTO "ACCOUNTS" ("LAST_NAME", "FIRST_NAME", "PASSWORD", "EMAIL")
VALUES ('Johnson', 'Emily', 'securepass', 'emily.johnson@example.com');

-- Insert 3
INSERT INTO "ACCOUNTS" ("LAST_NAME", "FIRST_NAME", "PASSWORD", "EMAIL")
VALUES ('Brown', 'Christopher', 'pass123', 'christopher.brown@example.com');

-- Insert 4
INSERT INTO "ACCOUNTS" ("LAST_NAME", "FIRST_NAME", "PASSWORD", "EMAIL")
VALUES ('Miller', 'Emma', 'qwerty', 'emma.miller@example.com');

-- Insert 5
INSERT INTO "ACCOUNTS" ("LAST_NAME", "FIRST_NAME", "PASSWORD", "EMAIL")
VALUES ('Davis', 'Sophia', '123456', 'sophia.davis@example.com');

-- Insert 6
INSERT INTO "ACCOUNTS" ("LAST_NAME", "FIRST_NAME", "PASSWORD", "EMAIL")
VALUES ('Martinez', 'Liam', 'password1234', 'liam.martinez@example.com');

-- Insert 7
INSERT INTO "ACCOUNTS" ("LAST_NAME", "FIRST_NAME", "PASSWORD", "EMAIL")
VALUES ('Garcia', 'Olivia', 'olivia123', 'olivia.garcia@example.com');

-- Insert 8
INSERT INTO "ACCOUNTS" ("LAST_NAME", "FIRST_NAME", "PASSWORD", "EMAIL")
VALUES ('Taylor', 'Noah', 'securepassword', 'noah.taylor@example.com');

-- Insert 9
INSERT INTO "ACCOUNTS" ("LAST_NAME", "FIRST_NAME", "PASSWORD", "EMAIL")
VALUES ('Anderson', 'Ava', 'myp@ssword', 'ava.anderson@example.com');

-- Insert 10
INSERT INTO "ACCOUNTS" ("LAST_NAME", "FIRST_NAME", "PASSWORD", "EMAIL")
VALUES ('Harris', 'Ethan', 'ethan123', 'ethan.harris@example.com');

UPDATE "ACCOUNTS"
SET "PASSWORD"=1
where "EMAIL" = 'A';
				
DELETE FROM "ACCOUNTS"
where "A_ID"=1;


SELECT * FROM "ACCOUNTS"
WHERE "EMAIL"=''
GROUP BY "A_ID";

--BUDGETS
Insert into "BUDGETS"("AMOUNT", "ID_BUDGET") 
values('1000',
(SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 1));

-- Insert 1
INSERT INTO "BUDGETS" ("AMOUNT", "ID_BUDGET")
VALUES ('1000', (SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 4));

-- Insert 2
INSERT INTO "BUDGETS" ("AMOUNT", "ID_BUDGET")
VALUES ('1200', (SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 5));

-- Insert 3
INSERT INTO "BUDGETS" ("AMOUNT", "ID_BUDGET")
VALUES ('800', (SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 6));

-- Insert 4
INSERT INTO "BUDGETS" ("AMOUNT", "ID_BUDGET")
VALUES ('1500', (SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 7));

-- Insert 5
INSERT INTO "BUDGETS" ("AMOUNT", "ID_BUDGET")
VALUES ('900', (SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 8));

-- Insert 6
INSERT INTO "BUDGETS" ("AMOUNT", "ID_BUDGET")
VALUES ('1100', (SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 9));

-- Insert 7
INSERT INTO "BUDGETS" ("AMOUNT", "ID_BUDGET")
VALUES ('1300', (SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 10));

-- Insert 8
INSERT INTO "BUDGETS" ("AMOUNT", "ID_BUDGET")
VALUES ('950', (SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 11));

-- Insert 9
INSERT INTO "BUDGETS" ("AMOUNT", "ID_BUDGET")
VALUES ('1400', (SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 12));

-- Insert 10
INSERT INTO "BUDGETS" ("AMOUNT", "ID_BUDGET")
VALUES ('1050', (SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 13));

-- Insert 11
INSERT INTO "BUDGETS" ("AMOUNT", "ID_BUDGET")
VALUES ('1200', (SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 14));



UPDATE "BUDGETS"
SET "AMOUNT" = "AMOUNT" + 4400
WHERE "ID_BUDGET" = 1;

SELECT "AMOUNT"
FROM "BUDGETS"
WHERE "ID_BUDGET"=1;
		
		
SELECT A."LAST_NAME", A."FIRST_NAME", B."AMOUNT"
FROM "ACCOUNTS" A
LEFT JOIN "BUDGETS" B ON B."ID_BUDGET"=A."A_ID"
ORDER BY B."AMOUNT", A."LAST_NAME", A."FIRST_NAME";

--EXPENSES
INSERT INTO "EXPENSES"("ID_PERSON", "AMOUNT_PAID", "DESCRIPTION", "FINAL_DATE", "E_CATEGORY")
VALUES((SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 1), 200, 'CURENT', CURRENT_DATE, (SELECT "CATEGORY" FROM "EXP_CATEGORIES" WHERE "CATEGORY" = 'MANCARE'));
		
UPDATE "EXPENSES"
SET "AMOUNT_PAID" = 0
WHERE "ID_PERSON" = 1;

SELECT A."LAST_NAME", A."FIRST_NAME", E."AMOUNT_PAID", E."DESCRIPTION"
FROM "ACCOUNTS" A
LEFT JOIN "EXPENSES" E ON E."ID_PERSON"=A."A_ID"
ORDER BY E."AMOUNT_PAID", A."LAST_NAME", A."FIRST_NAME";

--INCOMES
INSERT INTO "INCOMES" ("ID_PERSON", "AMOUNT_TAKEN", "PAYMENT_DATE", "DESCRIPTION", "I_CATEGORY")
VALUES((SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 1), 2000, CURRENT_DATE, 'SALARIU', (SELECT "CATEGORY" FROM "INC_CATEGORIES" WHERE "CATEGORY" = 'SALARIU'));

UPDATE "INCOMES"
SET "AMOUNT_TAKEN" = 3000
WHERE "ID_PROJECT"=2 AND "DESCRIPTION" = 'SALARIU';

SELECT EXTRACT(MONTH FROM "FINAL_DATE") AS "month", SUM("AMOUNT_PAID") AS "amount"
FROM "EXPENSES"
WHERE EXTRACT(YEAR FROM "FINAL_DATE") = EXTRACT(YEAR FROM CURRENT_DATE) AND "ID_PERSON" = 1
GROUP BY EXTRACT(MONTH FROM "FINAL_DATE");


--INVESTMENTS
INSERT INTO "INVESTMENTS" ("ID_PERSON", "TARGET_AMOUNT", "PRESENT_AMOUNT", "DESCRIPTION")
VALUES((SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 1), 5000, 0, 'BICICLETA NOUA');

SELECT A."FIRST_NAME", A."LAST_NAME", I."PRESENT_AMOUNT", I."TARGET_AMOUNT"
FROM "ACCOUNTS" A
LEFT JOIN "INVESTMENTS" I
ON I."ID_PERSON" = A."A_ID";

--CATEGORIES
INSERT INTO "INC_CATEGORIES" ("CATEGORY")
VALUES('SALARIU');

-- January
INSERT INTO "EXPENSES" ("ID_PERSON", "AMOUNT_PAID", "DESCRIPTION", "FINAL_DATE", "E_CATEGORY")
VALUES
    ((SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 1), 500, 'CURENT', '2024-12-15', (SELECT "CATEGORY" FROM "EXP_CATEGORIES" WHERE "CATEGORY" = 'MANCARE')),
    ((SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 1), 200, 'Utilitati', '2024-12-20', (SELECT "CATEGORY" FROM "EXP_CATEGORIES" WHERE "CATEGORY" = 'UTILITATI')),
    ((SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 1), 300, 'Haine', '2024-12-25', (SELECT "CATEGORY" FROM "EXP_CATEGORIES" WHERE "CATEGORY" = 'HAINE'));

INSERT INTO "INCOMES" ("ID_PERSON", "AMOUNT_TAKEN", "PAYMENT_DATE", "DESCRIPTION", "I_CATEGORY")
VALUES
    ((SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 1), 1000, '2024-12-05', 'SALARIU', (SELECT "CATEGORY" FROM "INC_CATEGORIES" WHERE "CATEGORY" = 'BANI PRIMITI')),
    ((SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 1), 400, '2024-12-10', 'VANZARI', (SELECT "CATEGORY" FROM "INC_CATEGORIES" WHERE "CATEGORY" = 'VANZARI'));

INSERT INTO "INCOMES"  ("ID_PERSON", "AMOUNT_TAKEN", "PAYMENT_DATE", "DESCRIPTION", "I_CATEGORY")
VALUES((SELECT "A_ID" FROM "ACCOUNTS" WHERE "A_ID" = 1), 4000, '2024-12-4', 'SALARIU', (SELECT "CATEGORY" FROM "CATEGORIES" WHERE "CATEGORY" = 'SALARIU'))

INSERT INTO "EXP_CATEGORIES" ("CATEGORY")
VALUES('UTILITATI');

INSERT INTO "INC_CATEGORIES" ("CATEGORY")
VALUES('BANI PRIMITI');

DELETE FROM "INCOMES"
WHERE "ID_INCOME" = 35;

DELETE FROM "INC_CATEGORIES"
WHERE "ID_CATEGORY" = 35;

DELETE FROM "EXP_CATEGORIES"
WHERE "ID_CATEGORY" = 5;


