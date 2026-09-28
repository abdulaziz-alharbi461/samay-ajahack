#!/usr/bin/env python3
"""
My Sky (سماي) - Predictive Astro-Tourism Platform for Hail, Saudi Arabia
Single-command runner script for hackathon live demo and evaluation.
"""
import sys
import os

# Fix Windows console UTF-8 output
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import uvicorn

def main():
    print("""
========================================================================
   🌌 سماي | MY SKY ASTRO-TOURISM PLATFORM
   Hail Dark Sky Reserve Predictive Engine & Directory
========================================================================
   ✓ Location: Hail, Saudi Arabia (Al-Nafud Dark Sky Park)
   ✓ Backend: FastAPI (REST API + Predictive Algorithmic Engine)
   ✓ Frontend: Modern Dark-Sky SPA (Tailwind + Leaflet + Chart.js)
   ✓ Language Support: Bilingual (Arabic RTL & English LTR)
------------------------------------------------------------------------
   🌐 Web Application : http://127.0.0.1:8000
   📑 API Interactive Docs : http://127.0.0.1:8000/docs
========================================================================
    """)
    # Ensure current directory is in sys.path
    project_dir = os.path.dirname(os.path.abspath(__file__))
    if project_dir not in sys.path:
        sys.path.insert(0, project_dir)

    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)

if __name__ == "__main__":
    main()
