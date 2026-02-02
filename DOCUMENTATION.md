# Investor Data Room - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Application Structure](#application-structure)
5. [Functional Components](#functional-components)
6. [User Workflows](#user-workflows)
7. [Technical Architecture](#technical-architecture)
8. [Setup & Installation](#setup--installation)

---

## Overview

The **Investor Data Room** is a secure, role-based document management system designed for due diligence processes in investment deals. It provides a DocSend-like secure viewer with watermarking, audit logging, and comprehensive access controls.

### Purpose
- Manage deal-level data rooms (one room per deal)
- Control document access with role-based permissions
- Track all user activities through immutable audit logs
- Provide secure document viewing with watermarks
- Enforce lifecycle controls (expiry, soft delete, hard delete, legal hold)

---

## Key Features

### 1. **Deal Management**
- **Deal-Level Data Rooms**: Each deal has its own isolated data room
- **Deal Status Tracking**: Monitor deal status (Due Diligence, etc.)
- **Room Lifecycle**: Track room expiry, soft delete periods, and legal hold status
- **Storage Model**: Container-per-Issuer with deal prefixes
  - Format: `issuer-{issuerId} → deals/{dealId}/dataroom/...`

### 2. **Document Management**
- **Folder Organization**: Organize documents into folders (Legal, Financials, Corporate, etc.)
- **Document Upload**: Issuers can upload documents to their deal rooms
- **Document Replacement**: Update existing documents
- **Document Deletion**: Remove documents (with audit trail)
- **Document Metadata**: Track file type, size, pages, uploader, and upload date

### 3. **Secure Document Viewer**
- **DocSend-like Experience**: Read-only viewer with watermarking
- **Watermarking**: Dynamic watermarks showing viewer identity, deal ID, and timestamp
- **Download Blocking**: Prevents unauthorized downloads (logged as audit events)
- **Print Blocking**: Prevents unauthorized printing (logged as audit events)
- **Page Navigation**: Navigate through multi-page documents
- **Zoom Controls**: Zoom in/out (80% to 160%)
- **Session Tracking**: Tracks viewing sessions with timestamps

### 4. **Access Control & Invitations**
- **Role-Based Access**: Different permissions for different user roles
- **User Invitations**: Issuers/Admins can invite internal and external users
- **Per-User Expiry**: Set individual access expiry dates for each user
- **External Sharing Toggle**: Enable/disable external guest access per deal
- **Access Status**: Track active/expired access grants

### 5. **Audit Logging**
- **Immutable Logs**: All actions are logged and cannot be modified
- **Comprehensive Tracking**: Tracks:
  - Document views (start/end)
  - Download attempts (blocked)
  - Print attempts (blocked)
  - Access denials (room expired, no grant, external sharing off)
  - Role switches
  - Admin actions
  - Document uploads/deletions
  - Folder creation
  - Invitations sent

### 6. **Admin Controls**
- **Global Policies**: Set platform-wide defaults
- **External Sharing Default**: Control whether external guests can be invited
- **Soft Delete Period**: Set grace period after room expiry before hard delete
- **Lifecycle Enforcement**: 
  - Room expiry disables access immediately
  - Soft delete keeps encrypted docs but blocks access
  - Hard delete permanently removes documents (audit logs retained)
  - Legal hold pauses deletion clocks

---

## User Roles & Permissions

### 1. **Issuer (Org Member)**
- **Full Management Access**:
  - Upload documents
  - Delete documents
  - Replace documents
  - Create folders
  - Invite users (internal and external)
  - View all documents
  - Access audit logs
- **Storage**: Documents stored under issuer's container

### 2. **Market Maker**
- **Read-Only Access**:
  - View documents (if granted access)
  - Cannot upload, delete, or modify
  - Cannot invite users
- **Access**: Must be explicitly invited to a deal

### 3. **Investor**
- **Read-Only Access**:
  - View documents (if granted access)
  - Cannot upload, delete, or modify
  - Cannot invite users
- **Access**: Must be explicitly invited to a deal

### 4. **External Guest**
- **Read-Only Access**:
  - View documents (if granted access and external sharing enabled)
  - Authenticated via OTP/guest login
  - Cannot upload, delete, or modify
  - Cannot invite users
- **Restrictions**: Can be blocked if deal has external sharing disabled

### 5. **Admin**
- **Override Access**:
  - All Issuer permissions
  - Global policy management
  - Legal hold controls
  - Force soft/hard delete
  - Access all deals regardless of access grants

---

## Application Structure

### Main Views

#### 1. **Deals View**
- Lists all available deals
- Shows deal status, issuer organization, pool ID
- Displays room expiry, soft delete period, external sharing status
- Search and filter functionality
- Select a deal to view its data room

#### 2. **Data Room View**
- **Left Sidebar**: Folder navigation
  - "All documents" view
  - Individual folder views (Legal, Financials, Corporate, etc.)
- **Main Panel**: Document table
  - Document list with metadata
  - Upload/Replace buttons (for Issuers)
  - View button for each document
  - Delete button (for Issuers)
- **Access Panel**: Shows all users with access to the room
  - Email, type (Internal/External), role, expiry date, status
  - Invite button (for Issuers/Admins)

#### 3. **Secure Viewer**
- Document preview with watermark
- Page navigation controls
- Zoom controls
- Download/Print buttons (blocked, logged)
- Fullscreen option
- Session information display

#### 4. **Audit Log View**
- Immutable log of all activities
- Filtered by selected deal
- Shows: timestamp, deal ID, user, role, action, target document, details
- Actions include:
  - VIEW_START, VIEW_END
  - DOWNLOAD_BLOCKED, PRINT_BLOCKED
  - ACCESS_DENIED_* (various reasons)
  - UPLOAD_OPEN, DELETE_DOC
  - INVITE_OPEN, FOLDER_CREATE_OPEN
  - ADMIN_POLICY_CHANGE
  - APPLY_LEGAL_HOLD, RELEASE_LEGAL_HOLD
  - FORCE_SOFT_DELETE, FORCE_HARD_DELETE

#### 5. **Admin Panel**
- Global policy settings
- Admin action buttons (illustrative)
- Lifecycle enforcement information

---

## Functional Components

### Core Components

#### **TopNav**
- Navigation bar with route switching
- Role selector dropdown
- Responsive design (tabs on mobile)
- Routes: Deals, Data Room, Viewer, Audit, Admin

#### **DealsList**
- Displays all deals in cards
- Search functionality
- Deal selection
- Shows deal metadata and status

#### **DealSummary**
- Summary card for selected deal
- Shows deal ID, issuer org, room status, expiry
- Storage layout information
- Permission indicators

#### **FolderSidebar**
- Folder navigation
- "All documents" option
- Create folder button (for Issuers)
- Active folder highlighting

#### **DocTable**
- Document listing table
- Columns: Document name, folder, uploaded date, uploaded by, actions
- Upload/Replace buttons (for Issuers)
- View/Delete buttons

#### **AccessPanel**
- Access list table
- Shows all users with access
- Invite button (for Issuers/Admins)
- Per-user expiry tracking

#### **Viewer**
- Secure document viewer
- Watermark overlay
- Page controls
- Zoom controls
- Download/Print blocking (with audit logging)

#### **AuditPanel**
- Audit log table
- Immutable records
- Filtered by deal
- Comprehensive action tracking

#### **AdminPolicyPanel**
- Global policy settings
- External sharing toggle
- Soft delete period control
- Lifecycle enforcement info

### Dialog Components

#### **InviteDialog**
- Invite users to data room
- Select party type (Internal/External)
- Select role (Investor, Market Maker, External Guest)
- Set expiry date
- Permission checks

#### **CreateFolderDialog**
- Create new folder
- Permission checks
- Folder naming

---

## User Workflows

### Workflow 1: Issuer Uploading Documents

1. **Select Deal**: Choose deal from deals list
2. **Navigate to Data Room**: Click "Open Data Room" or navigate to Room view
3. **Select Folder**: Choose existing folder or create new one
4. **Upload Document**: Click "Upload" button
5. **Select File**: Choose PDF/document to upload
6. **Document Appears**: Document appears in document table
7. **Audit Logged**: Upload action logged in audit trail

### Workflow 2: Investor Viewing Documents

1. **Select Deal**: Choose deal from deals list
2. **Check Access**: Verify access grant exists and is active
3. **Navigate to Data Room**: Open data room view
4. **Select Document**: Click "View" button on document
5. **Viewer Opens**: Secure viewer opens with watermark
6. **Navigate Pages**: Use page controls to navigate
7. **Zoom**: Adjust zoom if needed
8. **Attempt Download**: Click download (blocked, logged)
9. **Close Viewer**: Return to data room
10. **Audit Logged**: All actions logged (view start, page navigation, download attempt, view end)

### Workflow 3: Issuer Inviting Users

1. **Select Deal**: Choose deal
2. **Navigate to Access Panel**: Scroll to Access & Invitations section
3. **Click Invite**: Click "Invite" button
4. **Fill Form**:
   - Enter email address
   - Select party type (Internal/External)
   - Select role (Investor/Market Maker/External Guest)
   - Set expiry date
5. **Send Invite**: Click "Send Invite"
6. **Access Granted**: User appears in access list
7. **Audit Logged**: Invitation action logged

### Workflow 4: Admin Managing Policies

1. **Switch to Admin Role**: Use role selector
2. **Navigate to Admin**: Click Admin in navigation
3. **Adjust Policies**:
   - Toggle external sharing default
   - Adjust soft delete period
4. **Apply Legal Hold**: Click "Apply Legal Hold" if needed
5. **Audit Logged**: All policy changes logged

### Workflow 5: Access Denial Scenarios

#### Scenario A: Room Expired
1. User tries to view document
2. System checks room status
3. If expired, access denied
4. Redirected to audit log
5. ACCESS_DENIED_ROOM_EXPIRED logged

#### Scenario B: No Access Grant
1. Non-Issuer user tries to view document
2. System checks access list
3. If not found or inactive, access denied
4. Redirected to audit log
5. ACCESS_DENIED_NO_GRANT logged

#### Scenario C: External Sharing Disabled
1. External guest tries to view document
2. System checks external sharing toggle
3. If disabled, access denied
4. Redirected to audit log
5. ACCESS_DENIED_EXTERNAL_SHARING_OFF logged

---

## Technical Architecture

### Technology Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **Styling**: Tailwind CSS 3.4.19
- **Animations**: Framer Motion 12.29.2
- **Icons**: Lucide React 0.563.0
- **Utilities**: clsx, tailwind-merge

### Project Structure

```
investor-data-room/
├── src/
│   ├── components/
│   │   └── ui/              # Reusable UI components
│   │       ├── badge.jsx
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── dialog.jsx
│   │       ├── dropdown-menu.jsx
│   │       ├── input.jsx
│   │       ├── separator.jsx
│   │       ├── switch.jsx
│   │       ├── tabs.jsx
│   │       └── textarea.jsx
│   ├── lib/
│   │   └── utils.js         # Utility functions (cn)
│   ├── InvestorLayout.jsx   # Main application component
│   ├── App.jsx              # App entry point
│   ├── main.jsx             # React root
│   └── index.css            # Tailwind CSS imports
├── public/                  # Static assets
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── package.json            # Dependencies
```

### Key Design Patterns

1. **Component Composition**: UI components built with composition pattern
2. **Custom Hooks**: useState, useMemo for state management
3. **Context Pattern**: Used in Tabs, DropdownMenu, Dialog components
4. **Utility Functions**: cn() for className merging
5. **Role-Based Rendering**: Conditional rendering based on user role

### State Management

- **Local State**: useState hooks for component state
- **Derived State**: useMemo for computed values
- **Route State**: Route determines which view to show
- **Role State**: Current user role affects permissions

### Security Features

1. **Client-Side Enforcement**: UI-level permission checks
2. **Access Validation**: Checks before allowing document access
3. **Audit Trail**: All actions logged immutably
4. **Watermarking**: Visual protection against screenshots
5. **Download/Print Blocking**: Prevents unauthorized copying

### Data Model

#### Deal Object
```javascript
{
  id: "DEAL-ALPHA-01",
  issuerOrg: "Alpha Manufacturing Pvt Ltd",
  poolId: "POOL-ALPHA-01",
  status: "Due Diligence",
  dataRoom: {
    status: "ACTIVE",
    expiry: "2026-02-15",
    softDeleteDays: 14,
    legalHold: false,
    externalSharing: true
  },
  updatedAt: "2026-01-29"
}
```

#### Document Object
```javascript
{
  id: "DOC-1001",
  dealId: "DEAL-ALPHA-01",
  path: "Legal/",
  name: "Shareholders Agreement.pdf",
  type: "PDF",
  size: "2.4 MB",
  pages: 112,
  uploadedBy: "issuer_user1@alpha.com",
  uploadedAt: "2026-01-25"
}
```

#### Access Object
```javascript
{
  id: "ACC-01",
  dealId: "DEAL-ALPHA-01",
  partyType: "Internal",
  role: "MARKET_MAKER",
  email: "intaindemo_facilityagent@intainft.com",
  permission: "VIEW_ONLY",
  expiresOn: "2026-02-10",
  status: "ACTIVE"
}
```

#### Audit Event Object
```javascript
{
  id: "EVT-01",
  ts: "2026-01-30 10:14:05",
  dealId: "DEAL-ALPHA-01",
  user: "intaindemo_lender1@intainft.com",
  role: "Investor",
  action: "VIEW_START",
  target: "DOC-1002",
  details: "Loan Agreement.pdf"
}
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/SudarsanPerumal/Investor-data-room.git
   cd investor-data-room
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   - Navigate to `http://localhost:5173` (or port shown in terminal)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Configuration

### Tailwind CSS Configuration

Custom colors and theme variables defined in `tailwind.config.js`:
- Custom color palette using CSS variables
- Border radius utilities
- Extended theme for shadcn/ui compatibility

### Vite Configuration

Path aliases configured in `vite.config.js`:
- `@/` → `./src/`
- Enables clean imports: `import { Button } from "@/components/ui/button"`

### PostCSS Configuration

PostCSS processes Tailwind CSS:
- Tailwind CSS plugin
- Autoprefixer for browser compatibility

---

## Future Enhancements

### Potential Improvements

1. **Backend Integration**
   - Connect to real API endpoints
   - Implement actual authentication
   - Real document storage (Azure Blob Storage, S3, etc.)

2. **PDF.js Integration**
   - Replace mock viewer with actual PDF rendering
   - Support for other document types (Word, Excel, etc.)

3. **Advanced Features**
   - Document versioning
   - Comments and annotations
   - Document comparison
   - Bulk operations
   - Advanced search
   - Email notifications

4. **Security Enhancements**
   - Server-side permission enforcement
   - Encryption at rest
   - Two-factor authentication
   - IP whitelisting

5. **Analytics & Reporting**
   - Usage analytics dashboard
   - Download reports
   - Access reports by user/role
   - Document view statistics

---

## Support & Contact

For issues, questions, or contributions:
- GitHub Repository: https://github.com/SudarsanPerumal/Investor-data-room
- Create an issue for bug reports or feature requests

---

## License

This is a proof-of-concept (POC) application for demonstration purposes.

---

**Document Version**: 1.0  
**Last Updated**: February 2025

