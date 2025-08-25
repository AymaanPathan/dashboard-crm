if relation changes
npx prisma generate

if model adding
npx prisma migrate dev --name add_lead_ids_to_status
