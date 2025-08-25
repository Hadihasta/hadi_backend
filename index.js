import prisma from "./lib/prismaClient.js";
import express from "express";

const app = express();

// Middleware untuk parsing JSON body
app.use(express.json());

app.post("/api/add-meeting-book", async (req, res) => {
  try {
    const {
      unitId,
      roomId,
      meetingDate,
      startTime,
      endTime,
      participants,
      consumptionIds,
      nominalKonsumsi,
    } = req.body;

    const booking = await prisma.meetingBooking.create({
      data: {
        unitId,
        roomId,
        meetingDate: new Date(meetingDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        participants,
        nominalKonsumsi,
        consumption: {
          create: consumptionIds.map((id) => ({
            consumptionId: id,
          })),
        },
      },
      include: {
        room: true,
        unit: true,
        consumption: {
          include: { consumptionType: true },
        },
      },
    });

    return res.json({ success: true, booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
});

app.listen(3001, () =>
  console.log(" Server running on 3001")
);
