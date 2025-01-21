import { NextRequest, NextResponse } from "next/server";
import { STATUS_CODES } from "../_utils/constants";
import { createClient } from "@/app/_libs/utils/supabase/server";
import { Pagination } from "../_utils/constants";
import { getSearchPosts, getSearchUsers } from "../../_server/utils/queries";

export async function GET(request: NextRequest) {

	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user)
		return NextResponse.json({ message: "Unauthorized" }, { status: STATUS_CODES.UNAUTHORIZED });


	const query = request.nextUrl.searchParams.get("query");
	if (query === null || query.length === 0) {
		return NextResponse.json(
			{ message: "Search query cannot be null or empty" },
			{ status: STATUS_CODES.BAD_REQUEST }
		)
	}
	const page = request.nextUrl.searchParams.get("page");
	const from_uid = user.id;
	if (!page) {
		return NextResponse.json(
			{ message: "Missing page number" },
			{ status: STATUS_CODES.BAD_REQUEST }
		);
	}

	const key = request.nextUrl.searchParams.get('key');

	if (key === 'posts') {
		const { data, error } = await getSearchPosts(supabase, query, from_uid, parseInt(page), Pagination.LIMIT_POSTS);
		if (error) return NextResponse.json(error, { status: STATUS_CODES.SERVER_ERROR });
		return NextResponse.json(data, { status: STATUS_CODES.OK });
	}

	if (key === 'users') {
		const { data, error } = await getSearchUsers(supabase, query, parseInt(page), Pagination.LIMIT_POSTS);
		if (error) return NextResponse.json(error, { status: STATUS_CODES.SERVER_ERROR });
		return NextResponse.json(data, { status: STATUS_CODES.OK });
	}

	return NextResponse.json({ message: 'Invalid search key.' }, { status: STATUS_CODES.BAD_REQUEST })
}
