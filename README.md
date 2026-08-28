🛍️ Marketplace
<div align="center"> <img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&weight=700&size=32&pause=1200&color=F59E0B&center=true&vCenter=true&width=700&lines=Your+market%2C+now+online.;Discover.+Verify.+Reserve.+Connect.;Built+for+Cameroon.;From+clothes+to+land.;From+perfumes+to+apartments.;From+services+to+vehicles." alt="Marketplace animated typing banner" /> <br/>

A local social-commerce and discovery platform built for the Cameroonian context.

<br/> <img src="https://img.shields.io/badge/status-active%20development-F59E0B?style=for-the-badge&logo=github&logoColor=white" alt="Active development" /> <img src="https://img.shields.io/badge/built%20for-Cameroon-007A5E?style=for-the-badge" alt="Built for Cameroon" /> <img src="https://img.shields.io/badge/architecture-modular%20monolith-2563EB?style=for-the-badge" alt="Modular monolith" />

<br/><br/>

The internet is full of sellers.

Marketplace makes them discoverable, verifiable, and actionable.

</div>
🌍 The Idea

Small businesses and individuals already sell through WhatsApp, TikTok, Facebook, and Instagram.

Marketplace doesn't try to replace them.

It becomes the commerce layer underneath them.

                    ┌─────────────────────────┐
                    │       MARKETPLACE        │
                    │                         │
                    │  Discover • Verify      │
                    │  Reserve • Connect      │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
          WhatsApp           TikTok            Instagram
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                                 ▼
                         REAL-WORLD COMMERCE


A seller creates a business profile and publishes listings.

A buyer discovers products, verifies sellers, sees locations, checks availability, and takes action:

Reserve → Request a viewing → Contact the seller → Buy

From clothes to land.

From perfumes to apartments.

From services to vehicles.

It is a digital mall, except the mall also sells land.

⚡ The Problem

Selling through social media works.

Until it doesn't.

📩 Listings disappear inside chat threads
🔍 Buyers struggle to discover what they actually want
❓ There is no consistent way to verify sellers
📦 Inventory status is often unclear
⭐ Trust signals are fragmented or nonexistent
🕐 Buyers don't know whether something is still available
🧩 Every seller builds their own little system inside a messaging app

The result?

Commerce happens. But the infrastructure around it is chaotic.

Marketplace brings structure to that chaos.

🧠 What Marketplace Is

Marketplace is a discovery + trust + commerce layer sitting underneath the social platforms sellers already use.

                 SELLER
                    │
                    ▼
          ┌──────────────────┐
          │  Create Profile  │
          │  Publish Listing │
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │    MARKETPLACE   │
          │                  │
          │  Search          │
          │  Discovery       │
          │  Verification    │
          │  Reputation      │
          │  Availability    │
          │  Location        │
          └────────┬─────────┘
                   │
                   ▼
                 BUYER
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
     Reserve    Viewing    Contact
        │          │          │
        └──────────┼──────────┘
                   ▼
              TRANSACTION

The loop
Publish
   ↓
Discover
   ↓
Verify
   ↓
Reserve
   ↓
Meet
   ↓
Transact
   ↓
Reputation
   ↓
More Trust
   ↺


That loop is the product.

🛡️ Core Principles
🤝 Trust before transactions

Verification and reputation aren't decorative features.

They are the product.

📦 Availability matters

If something is sold, it shouldn't occupy prime discovery space.

Marketplace treats inventory state as a first-class concept.

AVAILABLE  ──────►  RESERVED  ──────►  SOLD
     ▲                  │
     │                  │
     └──────────────────┘
        reservation expires

🔎 Organic discovery first

Relevance comes before money.

Paid promotion can exist.

But it should never completely replace genuine discovery.

🇨🇲 Local first

Marketplace is not a generic marketplace with Cameroon added as an afterthought.

It is designed around how commerce actually happens here:

people + places + social platforms + trust + relationships.

🧱 Boring, understandable technology

No distributed-systems cosplay.

No microservices because a diagram looked cool.

No unnecessary infrastructure.

Just a modular monolith that works.

┌───────────────────────────────────────────────────┐
│                  MARKETPLACE API                  │
│                                                   │
│  Identity    Listings    Search    Reservations   │
│      │          │          │            │         │
│      ├──────────┼──────────┼────────────┤         │
│      │          │          │            │         │
│      ▼          ▼          ▼            ▼         │
│  Verification  Inventory  Discovery   Reputation │
│                                                   │
└───────────────────────┬───────────────────────────┘
                        │
                        ▼
                 ┌─────────────┐
                 │ PostgreSQL  │
                 └─────────────┘


Simple enough to understand.

Structured enough to grow.

🏙️ Built For
<div align="center">
👤	Marketplace is for
💬	The WhatsApp seller managing orders through chat
🏪	The boutique owner with no website
🏠	The landlord with an apartment to rent
🚗	The car dealer with vehicles to sell
🛠️	The service provider looking for local clients
🔎	The buyer tired of scrolling through unorganized posts
</div>
🔥 The Marketplace Experience
Seller
Create business
      ↓
Verify identity/business
      ↓
Create listing
      ↓
Set location
      ↓
Set availability
      ↓
Publish
      ↓
Share everywhere

Buyer
Search
  ↓
Discover
  ↓
Inspect listing
  ↓
Check seller
  ↓
Check location
  ↓
Check availability
  ↓
Reserve / View / Contact

The result

Less scrolling.

Less uncertainty.

More actual commerce.

📍 Local Discovery

Marketplace treats location as part of the product.

Not just:

"Nike sneakers — 45,000 FCFA"

But:

Nike Air Force 1
📍 Douala, Littoral
🟢 Available
🛡️ Verified seller
⭐ 4.8 reputation
Reserve for 60 minutes

The marketplace should answer the questions buyers actually care about:

What is it?
      +
Who is selling it?
      +
Where are they?
      +
Is it available?
      +
Can I trust them?
      +
What can I do next?

⏱️ Reservations

One of the simplest ideas can eliminate a surprisingly large amount of marketplace chaos:

temporary inventory holds.

Example:

10:00 ─────────────────────────────────── 11:00

        BUYER RESERVES
              │
              ▼
        ┌───────────┐
        │ RESERVED  │
        │ 60 MIN    │
        └─────┬─────┘
              │
       ┌──────┴──────┐
       ▼             ▼
    PURCHASE      EXPIRES
       │             │
       ▼             ▼
      SOLD        AVAILABLE


A buyer reserves.

The inventory is held.

The buyer shows up.

The transaction happens.

Or the reservation expires and the item becomes available again.

Simple. Predictable. Local.

🌐 Social Distribution

Marketplace is not trying to become another isolated island on the internet.

Listings should travel.

                    ┌──────────────┐
                    │  MARKETPLACE │
                    └───────┬──────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
            WhatsApp     TikTok     Instagram
                │           │           │
                └───────────┼───────────┘
                            ▼
                         BUYER

Publish once.
Discover everywhere.
Bring the transaction back to Marketplace.

That's the idea.

🧰 Built With
<div align="center"> <img src="https://skillicons.dev/icons?i=cs,dotnet,postgres,react,typescript&theme=dark" alt="C#, .NET, PostgreSQL, React and TypeScript" />

<br/><br/>

C# · ASP.NET Core · Entity Framework Core · PostgreSQL · React

<br/>

Modular Monolith · REST API · Relational Data · Structured Discovery

</div>
🏗️ Architecture

Marketplace deliberately starts as a modular monolith.

                       ┌─────────────────┐
                       │     React       │
                       │   Frontend      │
                       └────────┬────────┘
                                │
                                │ HTTP
                                ▼
┌─────────────────────────────────────────────────────────┐
│                   ASP.NET CORE API                      │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐ │
│  │ Identity │ │ Listings │ │ Search   │ │ Trust     │ │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘ │
│                                                         │
│  ┌──────────────┐ ┌────────────┐ ┌──────────────────┐ │
│  │ Reservations │ │ Locations  │ │ Reputation       │ │
│  └──────────────┘ └────────────┘ └──────────────────┘ │
│                                                         │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ PostgreSQL  │
                    └─────────────┘

Why?

Because complexity should be earned.

The goal isn't to build the most impressive architecture.

The goal is to build the most understandable system that can support the product.

🧭 Development Philosophy
                UNDERSTAND
                    │
                    ▼
                 MODEL
                    │
                    ▼
                  BUILD
                    │
                    ▼
                 VERIFY
                    │
                    ▼
                 SIMPLIFY
                    │
                    ▼
                  SHIP
                    │
                    └──────────────► UNDERSTAND BETTER


Backend first.

Understanding first.

Layer by layer.

🚧 Status
<div align="center">
🟡 ACTIVE DEVELOPMENT

The foundation is being built layer by layer.

Backend first. Understanding first.

<br/>

████████░░░░░░░░░░░░ Building the foundation

</div>
🎯 The Vision

Imagine this:

A seller in Douala lists a pair of sneakers.

A buyer in Yaoundé discovers them through search.

They check the seller's verification status.

They see the location.

They see that the item is available.

They reserve it.

The seller shares the same listing to their WhatsApp status.

The reservation holds the inventory for 60 minutes.

The buyer shows up.

The transaction happens.

        SELLER
          │
          │ lists
          ▼
    ┌─────────────┐
    │ MARKETPLACE │
    └──────┬──────┘
           │
           │ discovers
           ▼
         BUYER
           │
           │ verifies
           ▼
        SELLER ✓
           │
           │ reserves
           ▼
       INVENTORY
           │
           │ 60 min
           ▼
       MEET / BUY
           │
           ▼
      TRANSACTION
           │
           ▼
       REPUTATION
           │
           └──────────────► TRUST


That is the loop.

Marketplace is the layer that makes that loop reliable.

🇨🇲 Built for Cameroon

Marketplace starts here.

Not because Cameroon is a small version of somewhere else.

But because local commerce has its own shape.

People already sell.

People already buy.

People already discover products through social media.

People already use relationships and reputation to decide who to trust.

The missing piece is structure.

Marketplace provides it.

🏪 From a Digital Mall...
┌──────────────────────────────────────────┐
│              MARKETPLACE                 │
│                                          │
│   👕 Fashion       🏠 Property           │
│   💄 Beauty        🚗 Vehicles           │
│   🛠️ Services      📱 Electronics        │
│   🧴 Perfumes      🌱 More...            │
│                                          │
│        DISCOVER • VERIFY • BUY           │
└──────────────────────────────────────────┘

...to a Commerce Layer

The long-term goal isn't simply to have a website full of listings.

It is to create infrastructure around the commerce that is already happening.

Discovery.

Identity.

Trust.

Availability.

Reservations.

Reputation.

Distribution.

One layer at a time.

💡 The Name
Marketplace.

Direct.

Honest.

It is what it says.

The tagline says the rest:

Your market, now online.
<div align="center">
🛍️ Marketplace

Discover. Verify. Reserve. Connect.

<br/>

🇨🇲 Built for Cameroon.

<br/>

<sub>Built with C# · ASP.NET Core · EF Core · PostgreSQL · React</sub>

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:007A5E,50:FCD116,100:CE1126&height=100&section=footer" width="100%" alt="Cameroon-inspired animated footer" /> </div>
