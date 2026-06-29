import dbConfig from "@/middlewares/db.config";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helper/mailer";

export async function POST(request: NextRequest){
    try {
        await dbConfig();
        const reqBody = await request.json()
        const {email} = reqBody

        console.log(email);

        const user = await User.findOne({email})

        if (!user) {
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        
        console.log(user);

        //send reset email
        await sendEmail({email, emailType: "RESET", userId: user._id})

        return NextResponse.json({
            message: "Reset link sent to your email",
            success: true,
        })


    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
