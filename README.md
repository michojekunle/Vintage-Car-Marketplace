# Vintage Car Marketplace Dapp

## Overview

The **Vintage Car Marketplace Dapp** is a cutting-edge decentralized platform revolutionizing the way vintage cars are bought, sold, and auctioned. Built on blockchain technology, the platform enables users to own, trade, and service vintage cars in the form of **Non-Fungible Tokens (NFTs),** providing transparent, secure, and immutable proof of ownership.

The platform offers additional functionalities like **car model details, service history tracking,** and **mechanic services for** repair and maintenance. It integrates blockchain with e-commerce, providing an all-encompassing solution for vintage car enthusiasts, collectors, and mechanics.

Our main objective is to streamline the vintage car trade with **decentralization, transparency,** and **ownership** authenticity at the forefront of the experience.

## Key Features

### 1. NFT Marketplace

**Mint, List, and Sell Vintage Car NFTs**

Users can seamlessly mint NFTs representing ownership of their vintage cars. Each NFT is a unique digital certificate tied to the blockchain, representing a specific car with detailed metadata that includes everything from the car’s **make and model** to its **service history** and **current condition.** Sellers can choose to list these NFTs on the marketplace for **direct sales** or **auction.**

***1. Minting NFTs:*** Car owners mint NFTs that capture the essence of their vintage car's physical and mechanical attributes.
    
***2. Listing Options:*** Cars can be listed for **fixed-price sales** or for auctions, with customizable durations and starting bids.

***3. Ownership Transfer:*** Upon sale, the NFT representing the car is transferred to the buyer via a smart contract, ensuring a seamless, decentralized transaction.

**Detailed Car Information**

Each car’s NFT includes in-depth metadata that is stored on **IPFS.** This metadata consists of:

***1. Car Model Information:*** Make, model, year, and edition.

***2. Condition Details:*** Current mileage, restoration efforts, mechanical upgrades, or modifications.

***3. Service History:*** Complete records of all repairs and maintenance tasks carried out, all verifiable on the blockchain.

This level of detail offers buyers a clear picture of the vehicle's history and condition, significantly reducing the risks traditionally associated with purchasing vintage cars.

### 2. Auction System

**Timed Auctions with Bidding**

The marketplace provides an intuitive auction feature, where sellers can list their vintage car NFTs for a **timed auction.** Sellers can set an auction duration, minimum bid price, and reserve price.

***1. Real-time Bidding:*** Buyers place bids in real-time, and the highest bid at the end of the auction period wins.

***2. Auction Countdown:*** The platform features live countdown timers, ensuring transparency and urgency.

**Buyout Option**

For sellers who prefer to offer an immediate sale price, a **buyout option** can be added to the auction listing. This allows a buyer to bypass the bidding process and purchase the car outright at a set price.

***1. Flexible Selling:*** Sellers can cater to both auction enthusiasts and buyers looking for a faster, direct transaction.

### 3. Mechanic Services

**Service Booking**

After purchasing a car, buyers have the option to schedule **repair** and **maintenance services** directly through the platform. Verified mechanics can offer their services to maintain and restore vintage cars, ensuring that cars purchased through the platform remain in optimal condition.

***1. Booking Interface:*** The platform provides an intuitive scheduling system, allowing users to book services based on availability and geographic proximity.

***2. Verified Mechanics:*** Only mechanics who have undergone a KYC (Know Your Customer) verification process and proven their qualifications are eligible to offer services on the platform.

**Service Records on Blockchain**
All repair and maintenance services completed by a mechanic are documented and stored on the blockchain, ensuring the car's service history is transparently and immutably recorded.

***1. Transparent Records:*** Buyers can review a car’s full service history, enhancing its value and proving its well-maintained status.

***2. Immutable Data:*** All records are tamper-proof, ensuring that no fraudulent claims regarding a car’s condition can be made.

### 4. Verification and Reputation Systems

**Car Verification**

To ensure authenticity and prevent fraud, all vintage cars must undergo a rigorous verification process before they are minted as NFTs. Sellers are required to submit legal documentation proving ownership, such as:

*1. Title Deed*

*2. Vehicle Identification Number (VIN)*

*3. Registration Documents*

These documents are reviewed by platform administrators or through decentralized verification services (oracles), ensuring that the car is legitimate and not associated with any illegal activity.

**Mechanic Verification**

Mechanics looking to offer services must undergo a **Know Your Customer (KYC)** process and submit proof of their qualifications, including certifications and licenses. This ensures that only skilled, experienced, and certified mechanics are allowed to provide services on the platform.

**Reputation System**

The platform features a robust **reputation system** that tracks ratings and reviews for both mechanics and sellers. Users can rate mechanics after services are completed, and buyers can rate sellers after purchasing a car.

***1. Mechanic Ratings:*** High-rated mechanics gain greater visibility on the platform, and users can easily identify the best professionals for their needs.

***2. Seller Ratings:*** Sellers with a strong reputation for transparency and quality will be prioritized in search results.

## User Roles and Flows

#### 1. Buyer Flow

***Browse Listings:*** Buyers explore vintage cars on the platform using filters such as **make, model, year,** and **location.**

***Participate in Auctions or Direct Purchases:*** Buyers either bid on cars in auctions or use the buyout option for direct purchases.

***Service Booking:*** After purchasing a car, buyers can schedule mechanic services through the platform.

***Service Verification & Review:*** After service completion, buyers leave a review for the mechanic, contributing to the platform's reputation system.

#### 2. Seller Flow

***Minting an NFT:*** Sellers mint NFTs representing their vintage cars, providing detailed metadata about the car's specifications, history, and condition.

***Listing for Sale or Auction:*** Sellers choose between a fixed-price sale or an auction, setting parameters such as starting price, auction duration, and buyout options.

***Ownership Transfer:*** After a successful transaction, the NFT representing ownership is transferred to the buyer, and the seller receives payment in cryptocurrency.

#### 3. Mechanic Flow

***Profile Creation:*** Mechanics create a profile, complete KYC verification, and provide proof of their qualifications.

***Accept Service Requests:*** Mechanics receive service requests from buyers and accept jobs based on availability.

***Complete Services:*** Mechanics complete the service and update the car’s service records on the blockchain.

***Payment & Reviews:*** After confirmation by the buyer, mechanics are paid, and they receive ratings and reviews based on their service quality.

## Technology Stack

#### Blockchain Layer

***Blockchain Protocol:*** Lisk is used for minting NFTs, managing transactions, and executing smart contracts.

***Smart Contracts:*** Written in **Solidity,** these contracts handle the auction system, payment processes, and NFT creation and ownership transfers.

#### Frontend

***Next.js*** frameworks power the platform’s user interface.

***Wagmi*** manage all blockchain interactions, including connecting to wallets and executing smart contract functions.

#### Backend

***IPFS (InterPlanetary File System):*** Used to store and manage the metadata for each car's NFT, ensuring decentralized and tamper-resistant data storage.

#### Wallet Integration

The platform integrates with popular web3 wallets such as **MetaMask** and **other wallets** to allow users to securely manage their cryptocurrency and NFTs.

## Verification and Security

#### Car Verification Process

***Ownership Proof:*** Sellers must submit official documents such as the car’s title, registration, and VIN for verification before the car can be minted as an NFT.

***Blockchain Linkage:*** Each car’s data, including ownership history and service records, is immutably stored on the blockchain, ensuring transparency and authenticity.

#### Mechanic Verification Process

***KYC & Qualifications:*** Mechanics must verify their identity and qualifications through the platform’s KYC process before offering services.

***Reputation System:*** Mechanics build their reputation through user reviews and ratings, which help establish their credibility and increase their visibility on the platform.

## Addressing Loopholes

**1. Car Authenticity**

***Solution:*** A stringent verification process ensures that only legally owned and registered vintage cars can be minted as NFTs. External oracles will cross-check car titles, VINs, and registrations with government databases for authenticity.

**2. Mechanic Fraud Prevention**

***Solution:*** Mechanic qualifications and KYC checks prevent unqualified individuals from offering services. Smart contracts hold payment in escrow until both the mechanic and buyer confirm service completion.

**3. Dispute Resolution**

***Solution:*** A decentralized arbitration system will resolve disputes between buyers and mechanics, using blockchain evidence and user-submitted claims to ensure fairness.

## Future Development Plans

**1. Vintage Car History Tracking**

We aim to implement a system that tracks all previous ownership, transactions, and services related to a car. This history will add significant value to the NFT, providing a verifiable chain of custody.

**2. Social Features**

***Follow Sellers:*** Users can follow favorite sellers and mechanics, receiving updates on new listings and auctions.

***Auction Alerts:*** Buyers can set alerts for auctions based on criteria like car model, year, or location.

***Social Media Integration:*** Listings can be shared across social media platforms for increased visibility and promotion.

## Installation and Setup

**Prerequisites**

    • Node.js
    • npm or yarn
    • MetaMask or another Web3 wallet for testing purposes.

**Steps to Install**

    1. Clone the repository:
       bash
       Copy code
       git clone https://github.com/michojekunle/Vintage-Car-Marketplace.git

    2. Install dependencies:
       bash
       Copy code
       cd vintage-car-marketplace
       npm install

    3. Start the application:
       bash
       Copy code
       npm run dev

## Contributions

We welcome contributions from the community to help improve and expand the platform. To contribute, please submit a pull request or create an issue on our GitHub repository.

## Contributors

The following individuals contributed their expertise and time to make this project a success:

FRONTEND TEAM
***1. Abdulrahman Olalekan*** - [click here](https://github.com/RahmanC)
***2. Emeka-Iheonu Chimaobi*** - [click here](https://github.com/ceasermikes002)
***3. Michael Ojekunle*** - [click here](https://github.com/michojekunle)
***4. Yusuf Roqib*** - [click here](https://github.com/yusufroqib)
***5. Abolare Roheemah*** - [click here](https://github.com/AbolareRoheemah)

SMART CONTRACT TEAM
***6. Donald Nwokoro*** - [click here](https://github.com/DonGuillotine)
***7. Rose Wachuka*** - [click here](https://github.com/ro61zzy)
***8. Chisom Amadi*** -  [click here](https://github.com/Tchisom17)
***9. Michael John*** - [click here](https://github.com/Micjohn01)

## License
This project is licensed under the MIT License.
