const express = require('express');
const path = require('path');
const next = require('next');
const knex = require('knex');
const { Email } = require('@mui/icons-material');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    port: 5432,
    password: 'defendlaptop5451',
    database: 'financial_tracking'
  }
})


nextApp.prepare().then(() => {
  const app = express();

  let initialPath = path.join(__dirname, "app");

  app.use(express.json());
  app.use(express.static(initialPath));

   app.get('/register', (req, res) => {
    return nextApp.render(req, res, '/register');
  });

  app.get('/login', (req, res) => {
    return nextApp.render(req, res, '/login');
  });

  app.get('/budget', (req, res) => {
    return nextApp.render(req, res, '/budget');
  });

  app.get('/incomes', (req, res) => {
    return nextApp.render(req, res, '/incomes');
  });

  app.get('/expenses', (req, res) => {
    return nextApp.render(req, res, '/expenses');
  });

  app.get('/savings', (req, res) => {
    return nextApp.render(req, res, '/savings');
  });

  app.get('/categories', (req, res) => {
    return nextApp.render(req, res, '/categories');
  });

  app.get('/expensesForm', (req, res) => {
    return nextApp.render(req, res, '/expensesForm');
  });

  app.get('/incomesForm', (req, res) => {
    return nextApp.render(req, res, '/incomesForm');
  });

  app.get('/categoriesForm', (req, res) => {
    return nextApp.render(req, res, '/categoriesForm');
  });

  app.get('/savingsForm', (req, res) => {
    return nextApp.render(req, res, '/savingsForm');
  });

  app.get('/get-categories', async(req, res)=>{
    try{
      const incCategories = await db.select('ID_CATEGORY', 'CATEGORY').from('INC_CATEGORIES');
      const expCategories = await db.select('ID_CATEGORY','CATEGORY').from('EXP_CATEGORIES');

        res.json({
          expCategories: expCategories,
          incCategories: incCategories
        })

    }catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
  })

  app.post('/get-budget', async (req, res) => {
    const id = req.body.id; 
  
    try {
      const result = await db('BUDGETS').select('AMOUNT').where('ID_BUDGET', id).first();
  
      if (!result) {
        // If no budget is found for the given ID, return a 404 status
        return res.status(404).json({ error: 'Budget not found' });
      }
  
      const amount = result.AMOUNT; 
  
      res.json({
        budget: amount
      });
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  //------------------------------------------LOGIN:
  app.post('/login-user', async (req, res) => {
    const { email, password } = req.body;
  
    const user = await db
      .select('A_ID','EMAIL', 'PASSWORD', 'FIRST_NAME', 'LAST_NAME')
      .from('ACCOUNTS')
      .where({
        EMAIL: email,
      })
      .first();
  
    if (user && user.PASSWORD === password) {
      res.json({
        success: true,
        email: user.EMAIL,
        first_name: user.FIRST_NAME,
        last_name: user.LAST_NAME,
        id: user.A_ID
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  });

//----------------------------------REGISTER:

  app.post('/register-user', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
      // Check if user already exists
      const userExists = await db('ACCOUNTS').where({ EMAIL: email }).first();
      if (userExists) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      // Insert new user into database
      const newUser = await db('ACCOUNTS').insert({
        EMAIL: email,
        PASSWORD: password,
        FIRST_NAME: firstName,
        LAST_NAME: lastName
      }).returning(["EMAIL", "FIRST_NAME", "LAST_NAME"]);

      res.status(201).json({ message: 'User created successfully', user: newUser[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

//------------------------------------EXPENSES:

app.post('/card-expenses', async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const expenses = await db.select('ID_EXP','AMOUNT_PAID', 'FINAL_DATE', 'DESCRIPTION', "E_CATEGORY")
      .from('EXPENSES').where('ID_PERSON', user_id);

    //console.log("expenses: ", expenses);


    res.json({
      expenses: expenses,
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/delete-expense/:id', async (req, res) => {
  let trx;  // Initialize the transaction variable outside the try-catch block

  try {
    const eID = parseInt(req.params.id);
    const id_user = req.body.user_id;

    // Start a transaction
    trx = await db.transaction();
    
    const expense = await db('EXPENSES').select('AMOUNT_PAID').where('ID_EXP', eID).first();

    const budget = await db('BUDGETS').select('AMOUNT').where('ID_BUDGET', id_user).first();

    const newAmount = budget.AMOUNT + expense.AMOUNT_PAID;

    await db('BUDGETS').update('AMOUNT', newAmount).where('ID_BUDGET', id_user);

    await db('EXPENSES').where('ID_EXP', eID).delete();

    // Commit the transaction
    await trx.commit();

    res.status(200).json({ message: 'Expense deleted successfully!' });
  } catch (error) {
    console.error('Failed to delete expense:', error);

    // Rollback the transaction in case of an error
    if (trx) {
      await trx.rollback();
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/insert-expense', async (req, res) => {
  const expense  = req.body.exp;
  const id_user = req.body.userId;


  try {
    await db.transaction(async (trx) => {
      const currentAmountResult = await trx('BUDGETS')
        .select('AMOUNT')
        .where('ID_BUDGET', id_user)
        .first();

      if (!currentAmountResult) {
        throw new Error('Budget not found for user_id: ' + id_user);
      }

      const currentAmount = currentAmountResult.AMOUNT;

      // Insert the new expense
      await trx('EXPENSES').insert({
        ID_PERSON: db('ACCOUNTS').select('A_ID').where('A_ID', id_user),
        AMOUNT_PAID: parseInt(expense.AMOUNT_PAID),
        FINAL_DATE: expense.FINAL_DATE,
        DESCRIPTION: expense.DESCRIPTION,
        E_CATEGORY: db('EXP_CATEGORIES').select('CATEGORY').where('CATEGORY', expense.E_CATEGORY),
      });

      // Calculate the new budget amount
      const newAmount = currentAmount - expense.AMOUNT_PAID;

      // Update the budget amount
      await trx('BUDGETS').update('AMOUNT', newAmount).where('ID_BUDGET', id_user);
    });

    res.status(200).json({ message: 'Expense created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

app.post('/update-expense', async (req, res)=>{
  try{
    const id_user = req.body.user_id;
    const exp_id = parseInt(req.body.ID_EXP);
    const category = req.body.E_CATEGORY;
    const description = req.body.DESCRIPTION;
    const amount = req.body.AMOUNT_PAID;
    const date = req.body.FINAL_DATE;
    //console.log('category.update-expense: ', category);
    await db('EXPENSES')
    .where({ ID_EXP: exp_id, ID_PERSON: id_user })
    .update({
      E_CATEGORY: db('EXP_CATEGORIES').select('CATEGORY').where('CATEGORY', category),
      DESCRIPTION: description,
      AMOUNT_PAID: amount,
      FINAL_DATE: date,
    });

    res.status(200).json({ ok: true, message: 'Expense updated successfully' });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});



//--------------------------------------------------INCOMES:
app.post('/card-incomes', async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const incomes = await db.select('ID_INCOME','AMOUNT_TAKEN', 'PAYMENT_DATE', 'DESCRIPTION', "I_CATEGORY")
      .from('INCOMES').where('ID_PERSON', user_id);


    res.json({
      incomes: incomes,
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/insert-income', async(req, res)=>{
  const income = req.body.inc;
  const id_user = req.body.userId;
  

  try{
    await db.transaction(async(trx)=>{

      await trx('INCOMES').insert({
        ID_PERSON: db('ACCOUNTS').select('A_ID').where('A_ID', id_user),
        AMOUNT_TAKEN: income.AMOUNT_TAKEN,
        PAYMENT_DATE: income.PAYMENT_DATE,
        DESCRIPTION: income.DESCRIPTION,
        I_CATEGORY: db('INC_CATEGORIES').select('CATEGORY').where('CATEGORY', income.I_CATEGORY)
      })

      const currentAmountResult = await trx('BUDGETS')
        .select('AMOUNT')
        .where('ID_BUDGET', id_user)
        .first();

      if (!currentAmountResult) {
        throw new Error('Budget not found for user_id: ' + id_user);
      }

      const currentAmount = currentAmountResult.AMOUNT;
  
      const newAmount = currentAmount + income.AMOUNT_TAKEN;
  
      await trx('BUDGETS').update('AMOUNT', newAmount).where('ID_BUDGET', id_user);

      await trx.commit();

    });
    res.json({message: 'Income created succesfully!'});

  }
  catch(error){
    console.log(error);
    res.status(500).json({message: 'Internal server error!'})
  }

});

app.delete('/delete-income/:id', async (req, res) => {
  try {
    const inc_id = parseInt(req.params.id);
    const amount = req.body.amount;
    const user_id = req.body.user_id;
    //console.log('id_user', inc_id, 'amount', amount, 'user_id', user_id);

    // Start a transaction
    //console.log('am ajuns la deleteIncome srv!', inc_id);
    await db.transaction(async (trx) => {
      // Retrieve the current amount
      const currentAmountResult = await trx('BUDGETS')
        .select('AMOUNT')
        .where('ID_BUDGET', user_id)
        .first();

      if (!currentAmountResult) {
        throw new Error('Budget not found for user_id: ' + user_id);
      }

      const currentAmount = currentAmountResult.AMOUNT;

      // Ensure that the new amount is not negative
      if (currentAmount < amount) {
        throw new Error('Insufficient funds to delete income');
      }

      // Calculate the new amount
      const newAmount = currentAmount - amount;

      // Use the transaction object to perform the delete operation
      await trx('BUDGETS').update('AMOUNT', newAmount).where('ID_BUDGET', user_id);
      await trx('INCOMES').where('ID_INCOME', inc_id).delete();

      // Commit the transaction
      await trx.commit();
    });

    res.json({ message: 'Income deleted successfully!' });
  } catch (error) {
    console.error('Failed to delete income:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//-------------------------------------Category:
app.delete('/delete-category/:id', async (req, res) => {
  try {
    const cID = parseInt(req.params.id);
    const id_user = req.body.user_id;
    const type = req.body.type;
    //console.log('id_category', cID, 'type_category:', type);

    let categoryTable;
    let relatedRecords;

    if (type === 'Income') {
      categoryTable = 'INC_CATEGORIES';
      categoryName = await db('INC_CATEGORIES').select('CATEGORY').where('ID_CATEGORY', cID).first();
      relatedRecords = await db('INCOMES').where('I_CATEGORY', categoryName.CATEGORY);
    } else if (type === 'Expense') {
      categoryTable = 'EXP_CATEGORIES';
      categoryName = await db('EXP_CATEGORIES').select('CATEGORY').where('ID_CATEGORY', cID).first();
      relatedRecords = await db('EXPENSES').where('E_CATEGORY', categoryName.CATEGORY);
    } else {
      res.status(400).json({ message: 'Invalid category type!' });
      return;
    }

    if (relatedRecords.length === 0) {
      await db(categoryTable).where('ID_CATEGORY', cID).delete();
      res.status(200).json({ message: 'Category deleted successfully!' });
    } else {
      res.status(500).json({ message: `There are ${type.toLowerCase()}s that use this category!` });
    }
  } catch (error) {
    console.error('Failed to delete category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/insert-category', async (req, res) => {
  const category = req.body.cat;
  const id_user = req.body.userId;
  const type = req.body.type;

  try {
    if(type === "Income"){
      // Insert the new category
      await db('INC_CATEGORIES').insert({
        CATEGORY: category,
      });
    }else if(type === "Expense"){
      await db('EXP_CATEGORIES').insert({
        CATEGORY: category,
      });
    }


    res.status(200).json({ message: 'Category created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

app.post('/update-category', async (req, res) => {
  try {
    const cID = req.body.cID;
    const type = req.body.type;
    const name = req.body.name;
    //console.log('id_category', cID, 'type_category:', type);

    let categoryTable, categoryColumn, nameColumn, typeTable;

    if (type === 'Income') {
      categoryTable = 'INC_CATEGORIES';
      categoryColumn = 'I_CATEGORY';
      nameColumn = 'I_CATEGORY';
      typeTable = 'INCOMES';
    } else if (type === 'Expense') {
      categoryTable = 'EXP_CATEGORIES';
      categoryColumn = 'E_CATEGORY';
      nameColumn = 'E_CATEGORY';
      typeTable = 'EXPENSES';
    } else {
      res.status(400).json({ ok: false, message: 'Invalid category type!' });
      return;
    }

    // Check if the new category name exists in the category table
    const categoryExists = await db(categoryTable)
      .select('ID_CATEGORY')
      .where('CATEGORY', name)
      .first();

    if (categoryExists) {
      res.status(400).json({ ok: false, message: 'Category already exists!' });
      return;
    }

    await db.transaction(async (trx) => {

      // Update the category name in the category table
      await trx(categoryTable)
        .update('CATEGORY', name)
        .where('ID_CATEGORY', cID);

      await trx.commit();
    });

    res.status(200).json({ ok: true, message: 'Category updated successfully!' });

  } catch (error) {
    console.error('Failed to update category:', error);
    res.status(500).json({ ok: false, message: 'Internal server error' });
  }
});

//---------------------Charts

app.post('/components-piechart', async (req, res) => {
  try {
    const user_id = req.body.id;
    //console.log('Received user ID:', user_id);

    const categoryData = await db
      .select('EXP_CATEGORIES.CATEGORY as category', 'EXPENSES.AMOUNT_PAID as amount')
      .from('EXP_CATEGORIES')
      .leftJoin('EXPENSES', 'EXP_CATEGORIES.CATEGORY', 'EXPENSES.E_CATEGORY')
      .where('EXPENSES.ID_PERSON', user_id)
      .groupBy('EXP_CATEGORIES.CATEGORY', 'EXPENSES.AMOUNT_PAID');

    //console.log('Fetched data:', categoryData);

    const categoryAmount = categoryData.reduce((result, { category, amount }) => {
      if (category != null) {
        if (!result[category]) {
          // If the category doesn't exist in the result object, initialize it with the amount
          result[category] = amount;
        } else {
          // If the category already exists, accumulate the amount
          result[category] += amount;
        }
      }
      return result;
    }, {});

    //console.log('Category amount:', categoryAmount);

    res.json({ success: true, data: categoryAmount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/components-incomechart', async (req, res) => {
  try {
    const user_id = req.body.id;
    //console.log('Received user ID:', user_id);

    const categoryData = await db
      .select('INC_CATEGORIES.CATEGORY as category', 'INCOMES.AMOUNT_TAKEN as amount')
      .from('INC_CATEGORIES')
      .leftJoin('INCOMES', 'INC_CATEGORIES.CATEGORY', 'INCOMES.I_CATEGORY')
      .where('INCOMES.ID_PERSON', user_id)
      .groupBy('INC_CATEGORIES.CATEGORY', 'INCOMES.AMOUNT_TAKEN');

    //console.log('Fetched data:', categoryData);

    const categoryAmount = categoryData.reduce((result, { category, amount }) => {
      if (category != null) {
        if (!result[category]) {
          result[category] = amount;
        } else {
          result[category] += amount;
        }
      }
      return result;
    }, {});

    //console.log('Category amount:', categoryAmount);

    res.json({ success: true, data: categoryAmount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/expenses-chart-months', async (req, res) => {
  const user_id = req.body.id;

  try {
    // Get the current year
    const currentYear = new Date().getFullYear();
    //console.log('Sunt la expense-chart-data!');

    // Create an array to hold the monthly expense data
    const monthlyExpenses = new Array(12).fill(0);

    // Retrieve the monthly expense data from the database
    const expensesData = await db
    .select(db.raw('EXTRACT(MONTH FROM "FINAL_DATE") AS month'))
    .select(db.raw('SUM("AMOUNT_PAID") AS amount'))
    .from('EXPENSES')
    .where({
      ID_PERSON: user_id,
    })
    .andWhere(db.raw(`EXTRACT(YEAR FROM "FINAL_DATE") = ${currentYear}`))
    .groupBy(db.raw('EXTRACT(MONTH FROM "FINAL_DATE")'));

    //console.log('expenseData', expensesData);

    // Update the monthlyExpenses array with the data from the database
    expensesData.forEach((expense) => {
      monthlyExpenses[expense.month - 1] = expense.amount; 
    });

    //console.log('monthlyExpenses: ', monthlyExpenses);


    // Return the monthlyExpenses array as the response data
    res.json({ success: true, data: monthlyExpenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//------------------SAVINGS

app.post('/progress-bar-savings', async (req, res) =>{
  try {
    const user_id = req.body.user_id;

    const saving = await db('SAVINGS').select('PRESENT_AMOUNT', 'DESCRIPTION', 'TARGET_AMOUNT')
    .where('ID_PERSON', user_id).first();
    
    //console.log('saving: ', saving);

    if (!saving) {
      return res.status(404).json({ error: 'Saving not found for the user' });
    }

    res.json({
      saving: saving,
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

app.post('/savings-bars', async (req, res) =>{
  try {
    const user_id = req.body.user_id;

    const savings = await db('SAVINGS').select('ID_SAV', 'PRESENT_AMOUNT', 'TARGET_AMOUNT', 'DESCRIPTION')
    .where('ID_PERSON', user_id);

    if (!savings) {
      return res.status(404).json({ error: 'Saving not found for the user' });
    }

    res.json({
      savings: savings,
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

app.post('/insert-saving', async (req, res)=>{
  const user_id = req.body.userId;
  const saving = req.body.sav;

  try{


    await db.transaction(async(trx)=>{

      await trx('SAVINGS').insert({
        ID_PERSON: db('ACCOUNTS').select('A_ID').where('A_ID', user_id),
        PRESENT_AMOUNT: parseInt(saving.PRESENT_AMOUNT),
        TARGET_AMOUNT: parseInt(saving.TARGET_AMOUNT),
        DESCRIPTION: saving.DESCRIPTION,
      });
      
      const currentAmountResult = await trx('BUDGETS')
      .select('AMOUNT')
      .where('ID_BUDGET', user_id)
      .first();
      
      if (!currentAmountResult) {
        throw new Error('Budget not found for user_id: ' + id_user);
      }
      
      const currentAmount = currentAmountResult.AMOUNT;
        
      const newAmount = currentAmount - saving.PRESENT_AMOUNT;
        
      await trx('BUDGETS').update('AMOUNT', newAmount).where('ID_BUDGET', user_id);
      
      await trx.commit();
    });

    res.status(200).json({message: 'Saving created succesfuly!'})
          

  }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

app.delete('/delete-saving/:id', async (req, res) => {
  try {
    const sav_id = parseInt(req.params.id);
    const amountPresent = req.body.amount;
    const user_id = req.body.user_id;
    //console.log('id_user', inc_id, 'amount', amount, 'user_id', user_id);

    //console.log('am ajuns la deleteIncome srv!', inc_id);
    await db.transaction(async (trx) => {
      // Retrieve the current amount
      const currentBudget = await trx('BUDGETS')
        .select('AMOUNT')
        .where('ID_BUDGET', user_id)
        .first();

      if (!currentBudget) {
        throw new Error('Budget not found for user_id: ' + user_id);
      }

      const currentAmount = currentBudget.AMOUNT;

      // Calculate the new amount
      const newAmount = currentAmount + amountPresent;

      // Use the transaction object to perform the delete operation
      await trx('BUDGETS').update('AMOUNT', newAmount).where('ID_BUDGET', user_id);
      await trx('SAVINGS').where('ID_SAV', sav_id).delete();

      // Commit the transaction
      await trx.commit();
    });

    res.json({ message: 'Saving deleted successfully!' });
  } catch (error) {
    console.error('Failed to delete saving:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/add-saving-amount/:id', async (req, res) => {
  try {
    const sav_id = parseInt(req.params.id);
    const amountAdded = req.body.amountAdded;
    const amountPresent = req.body.amount;
    const targetAmount = req.body.targetAmount;
    const user_id = req.body.user_id;
    //console.log('id_user', sav_id, 'amount', amount, 'user_id', user_id);

    //console.log('am ajuns la deleteIncome srv!', inc_id);
    await db.transaction(async (trx) => {
      // Retrieve the current amount
      const currentBudget = await trx('BUDGETS')
        .select('AMOUNT')
        .where('ID_BUDGET', user_id)
        .first();

      if (!currentBudget) {
        throw new Error('Budget not found for user_id: ' + user_id);
      }

      const currentAmount = currentBudget.AMOUNT;

      const newPresentAmount = amountPresent + amountAdded;

      // Calculate the new amount
      const newAmount = currentAmount - amountAdded;

      // Use the transaction object to perform the delete operation
      await trx('BUDGETS').update('AMOUNT', newAmount).where('ID_BUDGET', user_id);
      await trx('SAVINGS').update('PRESENT_AMOUNT', newPresentAmount).where('ID_SAV', sav_id);

      // Commit the transaction
      await trx.commit();
    });

    res.json({ message: 'Amount added to saving successfully!' });
  } catch (error) {
    console.error('Failed to add amount to saving:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/take-saving-amount/:id', async (req, res) => {
  try {
    const sav_id = parseInt(req.params.id);
    const amountTook = req.body.amountTook;
    const amountPresent = req.body.amount;
    const targetAmount = req.body.targetAmount;
    const user_id = req.body.user_id;
    //console.log('id_user', sav_id, 'amount', amount, 'user_id', user_id);

    //console.log('am ajuns la deleteIncome srv!', inc_id);
    await db.transaction(async (trx) => {
      // Retrieve the current amount
      const currentBudget = await trx('BUDGETS')
        .select('AMOUNT')
        .where('ID_BUDGET', user_id)
        .first();

      if (!currentBudget) {
        throw new Error('Budget not found for user_id: ' + user_id);
      }

      const currentAmount = currentBudget.AMOUNT;

      const newPresentAmount = amountPresent - amountTook;

      // Calculate the new amount
      const newAmount = currentAmount + amountTook;

      // Use the transaction object to perform the delete operation
      await trx('BUDGETS').update('AMOUNT', newAmount).where('ID_BUDGET', user_id);
      await trx('SAVINGS').update('PRESENT_AMOUNT', newPresentAmount).where('ID_SAV', sav_id);

      // Commit the transaction
      await trx.commit();
    });

    res.json({ message: 'Amount took from saving successfully!' });
  } catch (error) {
    console.error('Failed to take amount from saving:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
});




  app.get('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(3000, () => {
    console.log('Listening on port 3000...');
  });
}).catch((error) => {
  console.error('An error occurred while starting the server:', error);
});
