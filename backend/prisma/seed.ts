import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

async function main() {
  const orgId = "245081ff-b919-4823-bf0c-6545371f7b3c";
  const verifiedById = "33681452-dd88-496b-9254-e67d9635f99e";

  console.log("🚀 Starting comprehensive seed...");

  // Create base orders for variety
  const orders = await Promise.all(
    Array.from({ length: 10 }).map(async (_, i) => {
      return await prisma.order.create({
        data: {
          orderNumber: `ORD-${String(i + 1).padStart(4, "0")}`,
          organizationId: orgId,
          totalAmount: 5000 + i * 1500,
          status: "confirmed",
          quotationId: "dab51e5d-1d06-4af7-9cce-3b70e3c5cdb1",
        },
      });
    })
  );

  const now = dayjs();
  let transactionCounter = 10000;

  // Helper function to create payment with transaction
  const createPaymentTransaction = async (
    orderId: string,
    amount: number,
    paidAt: Date
  ) => {
    const payment = await prisma.payment.create({
      data: {
        orderId,
        totalAmount: amount,
        amountPaid: amount,
        status: "completed",
        paidAt,
      },
    });

    await prisma.paymentTransaction.create({
      data: {
        paymentId: payment.id,
        amount,
        transactionId: `TXN-${transactionCounter++}`,
        method: ["UPI", "CARD", "NETBANKING", "CASH"][
          Math.floor(Math.random() * 4)
        ],
        status: "completed",
        paidAt,
        verifiedById,
        verifiedAt: paidAt,
      },
    });
  };

  // 🎯 YEAR VIEW DATA (2022-2025) - Show growth and decline
  console.log("📅 Creating yearly data (2022-2025)...");
  const yearlyAmounts = {
    2022: [3000, 4000, 3500, 4500, 5000, 4800, 5200, 5500], // Growing
    2023: [6000, 6500, 7000, 7500, 8000, 8500, 7000, 6500, 6000, 5500], // Peak then decline
    2024: [
      5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000, 11000,
    ], // Strong recovery
    2025: [
      12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000,
    ], // Current year growth
  };

  for (const [year, amounts] of Object.entries(yearlyAmounts)) {
    for (let i = 0; i < amounts.length; i++) {
      const randomMonth = Math.floor(Math.random() * 12);
      const randomDay = Math.floor(Math.random() * 28) + 1;
      const paidAt = dayjs(`${year}-${randomMonth + 1}-${randomDay}`).toDate();
      const order = orders[i % orders.length];
      await createPaymentTransaction(order.id, amounts[i], paidAt);
    }
  }

  // 🎯 MONTH VIEW DATA (Current month by weeks)
  console.log("📊 Creating current month data (by weeks)...");
  const currentMonth = now.month();
  const currentYear = now.year();

  // Week 1: High revenue
  for (let i = 0; i < 8; i++) {
    const day = Math.floor(Math.random() * 7) + 1;
    const paidAt = dayjs(`${currentYear}-${currentMonth + 1}-${day}`).toDate();
    await createPaymentTransaction(
      orders[i % orders.length].id,
      8000 + Math.random() * 2000,
      paidAt
    );
  }

  // Week 2: Moderate revenue
  for (let i = 0; i < 6; i++) {
    const day = Math.floor(Math.random() * 7) + 8;
    const paidAt = dayjs(`${currentYear}-${currentMonth + 1}-${day}`).toDate();
    await createPaymentTransaction(
      orders[i % orders.length].id,
      5000 + Math.random() * 1500,
      paidAt
    );
  }

  // Week 3: Declining revenue
  for (let i = 0; i < 4; i++) {
    const day = Math.floor(Math.random() * 7) + 15;
    const paidAt = dayjs(`${currentYear}-${currentMonth + 1}-${day}`).toDate();
    await createPaymentTransaction(
      orders[i % orders.length].id,
      3000 + Math.random() * 1000,
      paidAt
    );
  }

  // Week 4: Recovery
  for (let i = 0; i < 7; i++) {
    const day = Math.floor(Math.random() * 7) + 22;
    const paidAt = dayjs(`${currentYear}-${currentMonth + 1}-${day}`).toDate();
    await createPaymentTransaction(
      orders[i % orders.length].id,
      6000 + Math.random() * 2000,
      paidAt
    );
  }

  // 🎯 WEEK VIEW DATA (Current week by days)
  console.log("📈 Creating current week data (by days)...");
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const weekRevenue = {
    sunday: 12000, // Weekend high
    monday: 8000, // Week start
    tuesday: 9000,
    wednesday: 10000, // Mid-week peak
    thursday: 9500,
    friday: 11000, // End of week high
    saturday: 13000, // Weekend high
  };

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const dayName = daysOfWeek[dayOffset];
    const targetRevenue = weekRevenue[dayName as keyof typeof weekRevenue];
    const numTransactions = Math.floor(Math.random() * 3) + 2; // 2-4 transactions per day

    for (let i = 0; i < numTransactions; i++) {
      const paidAt = now
        .startOf("week")
        .add(dayOffset, "day")
        .add(Math.floor(Math.random() * 12) + 8, "hour") // 8 AM - 8 PM
        .toDate();

      await createPaymentTransaction(
        orders[i % orders.length].id,
        targetRevenue / numTransactions,
        paidAt
      );
    }
  }

  // 🎯 DAY VIEW DATA (Today by hours)
  console.log("⏰ Creating today's data (by hours)...");
  const hourlyPattern = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0, // Night - no activity
    8: 2000,
    9: 3500,
    10: 5000,
    11: 6000, // Morning ramp up
    12: 7000,
    13: 8000,
    14: 9000, // Peak afternoon
    15: 8500,
    16: 7500,
    17: 6000, // Declining
    18: 5000,
    19: 4000,
    20: 3000, // Evening
    21: 2000,
    22: 1000,
    23: 500, // Night wind down
  };

  for (const [hour, amount] of Object.entries(hourlyPattern)) {
    if (amount > 0) {
      const numTransactions = Math.floor(amount / 2000) + 1;
      for (let i = 0; i < numTransactions; i++) {
        const paidAt = now
          .startOf("day")
          .add(parseInt(hour), "hour")
          .add(Math.floor(Math.random() * 60), "minute")
          .toDate();

        await createPaymentTransaction(
          orders[i % orders.length].id,
          amount / numTransactions,
          paidAt
        );
      }
    }
  }

  // 🎯 ADDITIONAL HISTORICAL DATA for variety
  console.log("🔄 Creating additional historical data...");

  // Last 6 months with ups and downs
  for (let monthsAgo = 1; monthsAgo <= 6; monthsAgo++) {
    const isGoodMonth = monthsAgo % 2 === 0; // Alternate good and bad months
    const numTransactions = isGoodMonth ? 15 : 8;
    const baseAmount = isGoodMonth ? 7000 : 4000;

    for (let i = 0; i < numTransactions; i++) {
      const randomDay = Math.floor(Math.random() * 28) + 1;
      const paidAt = now.subtract(monthsAgo, "month").date(randomDay).toDate();

      await createPaymentTransaction(
        orders[i % orders.length].id,
        baseAmount + Math.random() * 2000,
        paidAt
      );
    }
  }

  console.log("✅ Comprehensive seed data inserted successfully!");
  console.log("📊 Data created for:");
  console.log(
    "   - Years: 2022-2025 (showing growth, peak, decline, recovery)"
  );
  console.log("   - Months: Current month by weeks (varied performance)");
  console.log("   - Weeks: Current week by days (realistic daily patterns)");
  console.log("   - Days: Today by hours (business hours pattern)");
  console.log("   - Additional: 6 months historical data with ups and downs");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Error while seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
