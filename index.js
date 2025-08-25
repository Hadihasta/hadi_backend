import prisma from "./lib/prismaClient.js";
import express from "express";

const app = express();
app.use(express.json());

// contoh endpoint ambil semua booking
app.get("/bookings", async (req, res) => {
  const bookings = await prisma.booking.findMany({
    include: {
      user: true,
      meetingRoom: true,
      consumptions: { include: { consumption: true } },
    },
  });
  res.json(bookings);
});

// contoh tambah booking
app.post("/bookings", async (req, res) => {
  const {
    userId,
    meetingRoomId,
    date,
    startTime,
    endTime,
    participants,
  } = req.body;
  const booking = await prisma.booking.create({
    data: {
      userId,
      meetingRoomId,
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      participants,
    },
  });
  res.json(booking);
});

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
