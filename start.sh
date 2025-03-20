#!/bin/bash

# Static fayllarni serve qilish uchun http-server o'rnatish
npm install -g http-server

# Frontend serverni ishga tushirish
http-server . -p 8080 &

# Backend serverni ishga tushirish
npm start
