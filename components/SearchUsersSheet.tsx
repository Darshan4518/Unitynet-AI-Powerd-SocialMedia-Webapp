"use client";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { searchUser } from "@/lib/actions/userActions";
import { IUser } from "@/models/User";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";

const SearchUsersSheet = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      if (query.trim()) {
        try {
          const { users } = await searchUser(query);
          setResults(users);
        } catch (error: any) {
          toast.error(error?.message);
        }
      } else {
        setResults([]);
      }
    };

    fetchUser();
  }, [query]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-zinc-200 hidden md:flex items-center"
        >
          <div className="flex gap-2 lg:mx-0 mx-auto items-center">
            <Search className="w-6 h-6" />
            <span className="hidden lg:block">Search</span>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-[400px] sm:w-[540px] bg-zinc-900 text-white hidden lg:block"
        side={"right"}
      >
        <SheetHeader>
          <SheetTitle>Search Users</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search by username"
            className="w-full p-2 text-sm bg-zinc-800 text-white rounded-md outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="mt-4">
          {query && results.length > 0 ? (
            <ul className="space-y-2">
              {results.map((user: IUser) => (
                <Link
                  href={`/profile/${user?._id.toString()}`}
                  key={user?._id?.toString()}
                  className="p-2 bg-zinc-800 rounded-md hover:bg-zinc-700 flex items-center gap-4"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-white">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback>DS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">{user?.name}</p>
                    <p className="text-xs">{user?.userName}</p>
                  </div>
                </Link>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">No users found.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SearchUsersSheet;
