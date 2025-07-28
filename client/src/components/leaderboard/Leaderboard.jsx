import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Crown } from "lucide-react";

const mockData = [
  {
    id: 1,
    username: "vighnesh",
    email: "vighnesh@gmail.com",
    questionsSubmitted: 12,
    answersReplied: 18,
    answersAccepted: 9,
  },
  {
    id: 2,
    username: "akash",
    email: "akash@gmail.com",
    questionsSubmitted: 20,
    answersReplied: 15,
    answersAccepted: 5,
  },
  {
    id: 3,
    username: "raj",
    email: "raj@gmail.com",
    questionsSubmitted: 8,
    answersReplied: 20,
    answersAccepted: 12,
  },
];

export default function LeaderboardTable() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("answersAccepted");

  useEffect(() => {
    const calculateRankScore = (user) =>
      user.answersAccepted * 5 +
      user.answersReplied * 2 +
      user.questionsSubmitted * 1;

    const dataWithScore = mockData.map((user) => ({
      ...user,
      rankScore: calculateRankScore(user),
    }));

    const sorted = [...dataWithScore].sort((a, b) => b[filter] - a[filter]);
    setUsers(sorted);
  }, [filter]);

  const getRankDisplay = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Crown className="w-5 h-5 text-yellow-500" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 font-bold">
              #1
            </Badge>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gray-500" />
            <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 font-bold">
              #2
            </Badge>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-amber-600" />
            <Badge className="bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0 font-bold">
              #3
            </Badge>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                {rank}
              </span>
            </div>
            <Badge variant="outline" className="font-mono font-medium">
              #{rank}
            </Badge>
          </div>
        );
    }
  };

  const getRowStyle = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-100/60 to-orange-100/60 dark:from-yellow-700/30 dark:to-orange-800/30 hover:dark:from-yellow-700 hover:dark:to-orange-700";
      case 2:
        return "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700/30 dark:to-slate-700/30 hover:dark:from-gray-600 hover:dark:to-slate-600";
      case 3:
        return "bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-800/30 dark:to-yellow-900/30 hover:dark:from-amber-700 hover:dark:to-yellow-800";
      default:
        return "hover:bg-muted/60 dark:hover:bg-zinc-800/60";
    }
  };


  return (
    <div className="p-4 mx-3 space-y-4 bg-white dark:bg-[#0f0f0f] rounded-xl transition-colors duration-300">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-zinc-800 to-gray-500 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
              Leaderboard
            </h2>
            <p className="text-sm text-muted-foreground">
              Top performers ranked by activity
            </p>
          </div>
        </div>
        <Select onValueChange={setFilter} defaultValue={filter}>
          <SelectTrigger className="w-[240px] shadow-sm dark:bg-zinc-800 dark:text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="dark:bg-zinc-800 dark:text-white">
            <SelectItem value="answersAccepted">✅ Answers Accepted</SelectItem>
            <SelectItem value="answersReplied">💬 Answers Replied</SelectItem>
            <SelectItem value="questionsSubmitted">❓ Questions Submitted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-white dark:bg-zinc-900 shadow-sm">
              <TableRow className="border-b bg-gradient-to-r from-gray-50 to-gray-100 dark:from-zinc-700 dark:to-zinc-800">
                <TableHead className="font-bold text-gray-800 dark:text-gray-100">
                  Rank
                </TableHead>
                <TableHead className="font-bold text-gray-800 dark:text-gray-100">
                  User
                </TableHead>
                <TableHead className="font-bold text-gray-800 dark:text-gray-100">
                  Questions
                </TableHead>
                <TableHead className="font-bold text-gray-800 dark:text-gray-100 text-right">
                  Replies
                </TableHead>
                <TableHead className="font-bold text-gray-800 dark:text-gray-100 text-right">
                  Accepted
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => {
                const rank = index + 1;
                return (
                  <TableRow
                    key={user.id}
                    className={`transition-all duration-200 border-b last:border-b-0 ${getRowStyle(rank)}`}
                  >
                    <TableCell className="py-4">
                      {getRankDisplay(rank)}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {user.username}
                        </div>
                        <div className="text-sm flex items-center gap-1 text-gray-500 dark:text-gray-300">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <Badge
                        variant="outline"
                        className="font-mono font-medium shadow-sm hover:shadow-md transition-shadow dark:border-zinc-600 dark:text-gray-100"
                      >
                        {user.questionsSubmitted}
                      </Badge>

                    </TableCell>
                    <TableCell className="text-right py-4">
                      <Badge
                        variant="outline"
                        className="font-mono font-medium shadow-sm hover:shadow-md transition-shadow dark:border-zinc-600 dark:text-gray-100"
                      >
                        {user.answersReplied}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <Badge
                        variant="outline"
                        className="font-mono font-medium shadow-sm hover:shadow-md transition-shadow dark:border-zinc-600 dark:text-gray-100"
                      >
                        {user.answersAccepted}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
