import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

//connect db
const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
    try {
        const videos = await prisma.video.findMany({
            orderBy: {createdAt: "desc"}
        })
        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json(
            {
            error: "Error while fetching videos"
            },
            {status: 401}
        )
    } finally {
        await prisma.$disconnect()
    }
}