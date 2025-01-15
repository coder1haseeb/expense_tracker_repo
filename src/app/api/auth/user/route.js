import { NextResponse } from "next/server";
import User from "@/models/User";

export async function PUT(request) {
  try {
    const { name, email, id } = await request.json();

    // Basic validation
    if (!name || !email || !id) {
      return NextResponse.json(
        { error: "Name, email, and user ID are required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findByPk(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user fields
    await user.update({ name, email });
    
    return NextResponse.json(
      { 
        message: "User updated successfully",
        user: { id: user.id, name: user.name, email: user.email } // Directly return the updated user object
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
