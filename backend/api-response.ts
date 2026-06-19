import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function badRequest(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

export function unauthorized(message = "Non autorisÃ©") {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function forbidden(message = "AccÃ¨s refusÃ©") {
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}

export function notFound(message = "Ressource introuvable") {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

export function serverError(error: unknown) {
  console.error(error);
  return NextResponse.json(
    { success: false, error: "Erreur serveur interne" },
    { status: 500 }
  );
}


