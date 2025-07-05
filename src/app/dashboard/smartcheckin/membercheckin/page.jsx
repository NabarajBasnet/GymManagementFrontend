'use client';

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Clock, CheckCircle, XCircle, Activity } from "lucide-react"

const gymLocation = {
    lat: 27.7121,
    lng: 85.3201,
    radius: 100,
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

const SmartAttendanceDashboard = () => {
    const [location, setLocation] = useState(null)
    const [sessionActive, setSessionActive] = useState(false)
    const [withinRange, setWithinRange] = useState(false)
    const [attendanceLogs, setAttendanceLogs] = useState([
        { id: 1, memberName: "John Doe", category: "Premium", membership: "Monthly", timestamp: new Date(Date.now() - 3600000) },
        { id: 2, memberName: "Sarah Wilson", category: "Basic", membership: "Yearly", timestamp: new Date(Date.now() - 7200000) },
        { id: 3, memberName: "Mike Johnson", category: "Premium", membership: "Monthly", timestamp: new Date(Date.now() - 10800000) },
    ])
    const [showAttendanceList, setShowAttendanceList] = useState(false)
    const [currentMember, setCurrentMember] = useState(null)

    // Mock member data for demonstration
    const mockMember = {
        id: 1,
        name: "John Doe",
        category: "Premium",
        membership: "Monthly",
        membershipExpiry: "2025-08-15",
        phone: "+977-9841234567",
        joinedDate: "2024-01-15",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    }

    useEffect(() => {
        if (!sessionActive) return

        const watch = navigator.geolocation.watchPosition(
            (pos) => {
                const coords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                }
                setLocation(coords)

                const dist = getDistanceFromLatLonInMeters(
                    coords.lat,
                    coords.lng,
                    gymLocation.lat,
                    gymLocation.lng
                )

                const inRange = dist <= gymLocation.radius
                setWithinRange(inRange)

                // Mock member detection when in range
                if (inRange && !currentMember) {
                    setCurrentMember(mockMember)
                } else if (!inRange && currentMember) {
                    setCurrentMember(null)
                }
            },
            (err) => {
                console.error("Location error", err)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        )

        return () => navigator.geolocation.clearWatch(watch)
    }, [sessionActive, currentMember])

    const startSession = () => {
        setSessionActive(true)
    }

    const stopSession = () => {
        setSessionActive(false)
        setCurrentMember(null)
        setWithinRange(false)
    }

    const checkInMember = () => {
        if (currentMember) {
            const newLog = {
                id: Date.now(),
                memberName: currentMember.name,
                category: currentMember.category,
                membership: currentMember.membership,
                timestamp: new Date()
            }
            setAttendanceLogs([newLog, ...attendanceLogs])
            setCurrentMember(null)
            setWithinRange(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Geo-Location Attendance System</h1>
                    <p className="text-gray-600">Track member check-ins using location-based verification</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Session Control & Live Check-in */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Session Control Card */}
                        <Card className="border-2 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Attendance Session Control
                                </CardTitle>
                                <CardDescription>
                                    Enable live session to track member check-ins within gym premises
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <MapPin className="h-4 w-4 text-blue-600" />
                                            Current Location
                                        </div>
                                        {location ? (
                                            <p className="text-sm text-gray-600 font-mono">
                                                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-400">Location unavailable</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <MapPin className="h-4 w-4 text-green-600" />
                                            Detection Range
                                        </div>
                                        <p className="text-sm text-gray-600">{gymLocation.radius} meters radius</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Session Status:</span>
                                        <Badge variant={sessionActive ? "default" : "secondary"} className="flex items-center gap-1">
                                            {sessionActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                            {sessionActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={startSession}
                                        disabled={sessionActive}
                                        className="flex-1"
                                    >
                                        {sessionActive ? "Session Running" : "Start Session"}
                                    </Button>
                                    <Button
                                        onClick={stopSession}
                                        disabled={!sessionActive}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Stop Session
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Live Check-in Detection */}
                        <Card className="border-2 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Live Member Detection
                                </CardTitle>
                                <CardDescription>
                                    Real-time detection of members within gym premises
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    {sessionActive ? (
                                        withinRange && currentMember ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-center">
                                                    <div className="relative">
                                                        <img
                                                            src={currentMember.photo}
                                                            alt={currentMember.name}
                                                            className="w-16 h-16 rounded-full object-cover border-4 border-green-500"
                                                        />
                                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                            <CheckCircle className="h-4 w-4 text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg text-green-600">{currentMember.name}</h3>
                                                    <p className="text-sm text-gray-600">Ready to check in</p>
                                                </div>
                                                <Button onClick={checkInMember} className="bg-green-600 hover:bg-green-700">
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Check In Member
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-gray-400">
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <Users className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <p className="text-sm">No member detected in range</p>
                                                <p className="text-xs text-gray-500 mt-1">Scanning for members...</p>
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-gray-400">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                <XCircle className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <p className="text-sm">Session not active</p>
                                            <p className="text-xs text-gray-500 mt-1">Start session to begin detection</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Attendance History Toggle */}
                        <Card className="border-2 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Today's Attendance
                                </CardTitle>
                                <CardDescription>
                                    View all member check-ins for today
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-sm">
                                            {attendanceLogs.length} Check-ins Today
                                        </Badge>
                                    </div>
                                    <Button
                                        onClick={() => setShowAttendanceList(!showAttendanceList)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        {showAttendanceList ? "Hide List" : "Show List"}
                                    </Button>
                                </div>

                                {showAttendanceList && (
                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {attendanceLogs.length === 0 ? (
                                            <p className="text-gray-400 text-sm text-center py-4">No check-ins yet today</p>
                                        ) : (
                                            attendanceLogs.map((log) => (
                                                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-sm">{log.memberName}</p>
                                                        <p className="text-xs text-gray-500">{log.category} • {log.membership}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-600">{log.timestamp.toLocaleTimeString()}</p>
                                                        <Badge variant="secondary" className="text-xs">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Checked In
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Member Details */}
                    <div className="lg:col-span-1">
                        <Card className="border-2 shadow-lg sticky top-6">
                            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Member Details
                                </CardTitle>
                                <CardDescription>
                                    Information about detected member
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                {currentMember ? (
                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <img
                                                src={currentMember.photo}
                                                alt={currentMember.name}
                                                className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 border-purple-200"
                                            />
                                            <h3 className="font-semibold text-lg">{currentMember.name}</h3>
                                            <p className="text-sm text-gray-600">Member ID: #{currentMember.id}</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm font-medium text-gray-600">Category:</span>
                                                <Badge variant={currentMember.category === "Premium" ? "default" : "secondary"}>
                                                    {currentMember.category}
                                                </Badge>
                                            </div>

                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm font-medium text-gray-600">Membership:</span>
                                                <span className="text-sm">{currentMember.membership}</span>
                                            </div>

                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm font-medium text-gray-600">Expiry:</span>
                                                <span className="text-sm">{currentMember.membershipExpiry}</span>
                                            </div>

                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm font-medium text-gray-600">Phone:</span>
                                                <span className="text-sm">{currentMember.phone}</span>
                                            </div>

                                            <div className="flex justify-between items-center py-2 border-b">
                                                <span className="text-sm font-medium text-gray-600">Joined:</span>
                                                <span className="text-sm">{currentMember.joinedDate}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <Button onClick={checkInMember} className="w-full bg-green-600 hover:bg-green-700">
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Check In Member
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Users className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-500">No member detected</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {sessionActive ? "Waiting for member to come in range..." : "Start session to detect members"}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SmartAttendanceDashboard;
