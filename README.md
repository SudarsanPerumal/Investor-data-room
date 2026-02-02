# Investor Data Room

A secure, role-based document management system for due diligence processes in investment deals. This application provides a DocSend-like secure viewer with watermarking, comprehensive audit logging, and granular access controls.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/SudarsanPerumal/Investor-data-room.git
cd investor-data-room

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:5173` (or the port shown in terminal).

## 📋 Features

- **Deal-Level Data Rooms**: One data room per deal with isolated document storage
- **Role-Based Access Control**: Five user roles with different permission levels
- **Secure Document Viewer**: DocSend-like viewer with watermarking and download/print blocking
- **Comprehensive Audit Logging**: Immutable logs of all user activities
- **Lifecycle Management**: Room expiry, soft delete, hard delete, and legal hold controls
- **User Invitations**: Invite internal and external users with per-user expiry dates
- **Folder Organization**: Organize documents into folders (Legal, Financials, Corporate, etc.)

## 👥 User Roles

1. **Issuer (Org Member)**: Full management access - upload, delete, invite users
2. **Market Maker**: Read-only access to documents
3. **Investor**: Read-only access to documents
4. **External Guest**: Read-only access (requires external sharing enabled)
5. **Admin**: Override access with global policy management

## 🏗️ Tech Stack

- **React 19.2.0** - UI Framework
- **Vite 7.3.1** - Build Tool
- **Tailwind CSS 3.4.19** - Styling
- **Framer Motion 12.29.2** - Animations
- **Lucide React** - Icons

## 📚 Documentation

For complete documentation including:
- Detailed feature descriptions
- User workflows
- Component architecture
- Technical specifications
- API/data models

See **[DOCUMENTATION.md](./DOCUMENTATION.md)**

## 🎯 Key Functionality

### Document Management
- Upload documents to deal rooms
- Organize into folders
- Replace existing documents
- Delete documents (with audit trail)

### Secure Viewing
- Watermarked document preview
- Page navigation and zoom controls
- Download/print blocking (logged)
- Session tracking

### Access Control
- Invite users by email
- Set per-user expiry dates
- Control external sharing per deal
- Track access status

### Audit & Compliance
- Immutable audit logs
- Track all user actions
- Monitor access denials
- Lifecycle event tracking

## 🔒 Security Features

- Role-based permission enforcement
- Access validation before document viewing
- Watermarking for document protection
- Download/print blocking
- Comprehensive audit trail
- Room expiry enforcement
- Legal hold support

## 📁 Project Structure

```
investor-data-room/
├── src/
│   ├── components/ui/     # Reusable UI components
│   ├── lib/              # Utility functions
│   ├── InvestorLayout.jsx # Main application
│   └── App.jsx           # Entry point
├── DOCUMENTATION.md      # Complete documentation
└── README.md            # This file
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 License

This is a proof-of-concept (POC) application for demonstration purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions:
- Create an issue on GitHub
- See [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed information

---

**Note**: This is a frontend mock/POC. Backend integration, authentication, and actual document storage would need to be implemented for production use.
