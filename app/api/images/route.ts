import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readdir, writeFile, unlink } from "fs/promises";

export const GET = async (req: NextRequest, res: NextResponse) => {
    try {
        const images = await readdir(path.join(process.cwd(), "public/uploaded/"))
        return NextResponse.json({ Message: "Success", data: images, status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};

export const POST = async (req: NextRequest, res: NextResponse) => {
    const formData = await req.formData();

    const files = formData.getAll("file");

    if (!files) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    try {
        files.map(async (file: any) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = file.name.replaceAll(" ", "_");

            await writeFile(
                path.join(process.cwd(), "public/uploaded/" + filename),
                buffer
            );
        })
        return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};

export const DELETE = async (req: NextRequest, res: NextResponse) => {
    try {
        const images = await readdir(path.join(process.cwd(), "public/uploaded/"))
        images.map(async image => await unlink(path.join(process.cwd(), "public/uploaded/" + image)))

        return NextResponse.json({ Message: "Success", status: 200 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};