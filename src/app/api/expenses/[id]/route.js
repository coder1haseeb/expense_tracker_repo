import { NextResponse } from 'next/server';
import Expense from '@/models/Expense';
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        error: "User ID is required"
      }, { status: 400 });
    }

    // Find expense that matches both id and userId
    const expense = await Expense.findOne({
      where: {
        id: id,
        userId: userId
      }
    });

    if (!expense) {
      return NextResponse.json({
        error: "Expense not found"
      }, { status: 404 });
    }

    return NextResponse.json(expense);

  } catch (error) {
    console.error('Error fetching expense:', error);
    return NextResponse.json({
      error: "Error fetching expense",
      details: error.message
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Find the expense
    const expense = await Expense.findByPk(id);

    if (!expense) {
      return NextResponse.json({ 
        error: "Expense not found" 
      }, { status: 404 });
    }

    // Update expense fields
    await expense.update({
      amount: body.amount,
      description: body.description,
      category: body.category,
      date: body.date,
      title: body.title,
      currency : body.currency
    });

    return NextResponse.json({ 
      message: "Expense updated successfully",
      expense 
    });

  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ 
      error: "Error updating expense",
      details: error.message 
    }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Find the expense
    const expense = await Expense.findByPk(id);

    if (!expense) {
      return NextResponse.json({ 
        error: "Expense not found" 
      }, { status: 404 });
    }

    // Delete the expense
    await expense.destroy();

    return NextResponse.json({ 
      message: "Expense deleted successfully" 
    });

  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ 
      error: "Error deleting expense",
      details: error.message 
    }, { status: 500 });
  }
}
