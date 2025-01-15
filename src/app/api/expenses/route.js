import { NextResponse } from 'next/server';
import Expense from '@/models/Expense';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("---------------------- Entering server side api -----------------------------------")
    console.log(body);
    
    // Create new expense
    const expense = await Expense.create(body);

    return NextResponse.json({ 
      message: "Expense created successfully",
      expense 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ 
      error: "Error creating expense",
      details: error.message 
    }, { status: 500 });
  }
}
export async function GET(request) {
  try {
    // Get userId from the URL search params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        error: "User ID is required" 
      }, { status: 400 });
    }
    console.log("---------------------- Entering server side api -----------------------------------")
    console.log(userId);
    // Fetch expenses for the user
    const expenses = await Expense.findAll({
      where: {
        userId: userId
      },
      order: [['date', 'DESC']] // Sort by date descending
    });

    return NextResponse.json(expenses);

  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ 
      error: "Error fetching expenses",
      details: error.message 
    }, { status: 500 });
  }
}


