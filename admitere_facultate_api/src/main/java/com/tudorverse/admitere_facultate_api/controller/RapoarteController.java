package com.tudorverse.admitere_facultate_api.controller;

import com.tudorverse.admitere_facultate_api.dto.ProgramStudiuResponse;
import com.tudorverse.admitere_facultate_api.dto.RaportFacultateResponse;
import com.tudorverse.admitere_facultate_api.dto.RaportInscrieriProgramResponse;
import com.tudorverse.admitere_facultate_api.dto.RezultatAdmitereResponse;
import com.tudorverse.admitere_facultate_api.model.Optiune;
import com.tudorverse.admitere_facultate_api.repository.OptiuneRepository;
import com.tudorverse.admitere_facultate_api.repository.ProgramStudiuRepository;
import com.tudorverse.admitere_facultate_api.service.ProcesareAdmitereService;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Rapoarte doar pentru citire pentru rezultatele procesarii admiterii.
 */
@RestController
@RequestMapping("/api/admin/rapoarte")
public class RapoarteController {

  private final ProcesareAdmitereService procesareAdmitereService;
  private final ProgramStudiuRepository programStudiuRepository;
  private final OptiuneRepository optiuneRepository;

  public RapoarteController(ProcesareAdmitereService procesareAdmitereService,
      ProgramStudiuRepository programStudiuRepository,
      OptiuneRepository optiuneRepository) {
    this.procesareAdmitereService = procesareAdmitereService;
    this.programStudiuRepository = programStudiuRepository;
    this.optiuneRepository = optiuneRepository;
  }

  @GetMapping("/inscrieri-program")
  public List<RaportInscrieriProgramResponse> raportInscrieriProgram(
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate start,
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate end) {
    return buildRaportInscrieriProgram(start, end);
  }

  @GetMapping("/inscrieri-program.csv")
  public ResponseEntity<String> raportInscrieriProgramCsv(
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate start,
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate end) {
    String csv = toCsv(buildRaportInscrieriProgram(start, end));
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"raport-inscrieri-program.csv\"")
        .contentType(MediaType.parseMediaType("text/csv"))
        .body(csv);
  }

  @GetMapping("/inscrieri-program.pdf")
  public ResponseEntity<byte[]> raportInscrieriProgramPdf(
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate start,
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate end)
      throws IOException {
    byte[] data = toPdf(buildRaportInscrieriProgram(start, end));
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"raport-inscrieri-program.pdf\"")
        .contentType(MediaType.APPLICATION_PDF)
        .body(data);
  }

  @GetMapping("/rezultate-facultati")
  public List<RaportFacultateResponse> raportRezultateFacultati(
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate start,
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate end) {
    List<RezultatAdmitereResponse> rezultate = filterByDate(
        procesareAdmitereService.getUltimeleRezultate(), start, end);
    if (rezultate.isEmpty()) {
      return List.of();
    }

    Map<Long, ProgramStudiuResponse> programe = new HashMap<>();
    Map<Long, String> facultateByProgram = new HashMap<>();
    for (ProgramStudiuResponse program : programStudiuRepository.findAllWithFacultate()) {
      programe.put(program.id(), program);
      facultateByProgram.put(program.id(), program.facultateNume());
    }

    Map<String, RaportFacultateResponse> byFaculty = new TreeMap<>();
    for (ProgramStudiuResponse program : programe.values()) {
      byFaculty.putIfAbsent(program.facultateNume(),
          new RaportFacultateResponse(program.facultateNume(), 0, 0));
    }

    Set<Long> respinsDosarIds = rezultate.stream()
        .filter(result -> "RESPINS".equals(result.status()))
        .map(RezultatAdmitereResponse::dosarId)
        .collect(Collectors.toSet());

    Map<Long, String> respinsFacultate = new HashMap<>();
    if (!respinsDosarIds.isEmpty()) {
      List<Long> dosarIds = new ArrayList<>(respinsDosarIds);
      List<Optiune> optiuni = optiuneRepository
          .findByDosarIdInOrderByDosarIdAscPrioritateAsc(dosarIds);
      for (Optiune optiune : optiuni) {
        if (respinsFacultate.containsKey(optiune.getDosarId())) {
          continue;
        }
        String facultate = facultateByProgram.get(optiune.getProgramId());
        if (facultate != null) {
          respinsFacultate.put(optiune.getDosarId(), facultate);
        }
      }
    }

    for (RezultatAdmitereResponse rezultat : rezultate) {
      if ("ADMIS".equals(rezultat.status()) && rezultat.facultateNume() != null) {
        RaportFacultateResponse current = byFaculty.get(rezultat.facultateNume());
        if (current == null) {
          current = new RaportFacultateResponse(rezultat.facultateNume(), 0, 0);
        }
        byFaculty.put(rezultat.facultateNume(),
            new RaportFacultateResponse(rezultat.facultateNume(),
                current.admisi() + 1, current.respinsi()));
      } else if ("RESPINS".equals(rezultat.status())) {
        String facultate = respinsFacultate.get(rezultat.dosarId());
        if (facultate == null) {
          continue;
        }
        RaportFacultateResponse current = byFaculty.get(facultate);
        if (current == null) {
          current = new RaportFacultateResponse(facultate, 0, 0);
        }
        byFaculty.put(facultate,
            new RaportFacultateResponse(facultate, current.admisi(),
                current.respinsi() + 1));
      }
    }

    return new ArrayList<>(byFaculty.values());
  }

  private List<RaportInscrieriProgramResponse> buildRaportInscrieriProgram(
      LocalDate start, LocalDate end) {
    List<RezultatAdmitereResponse> rezultate = filterByDate(
        procesareAdmitereService.getUltimeleRezultate(), start, end);

    Map<Long, Integer> inscrisiByProgram = new HashMap<>();
    for (RezultatAdmitereResponse rezultat : rezultate) {
      if (!"ADMIS".equals(rezultat.status()) || rezultat.programId() == null) {
        continue;
      }
      inscrisiByProgram.merge(rezultat.programId(), 1, Integer::sum);
    }

    List<ProgramStudiuResponse> programe = programStudiuRepository.findAllWithFacultate();
    List<RaportInscrieriProgramResponse> report = new ArrayList<>(programe.size());
    for (ProgramStudiuResponse program : programe) {
      int count = inscrisiByProgram.getOrDefault(program.id(), 0);
      report.add(new RaportInscrieriProgramResponse(program.id(),
          program.nume(), program.facultateNume(), count));
    }

    report.sort(Comparator
        .comparing(RaportInscrieriProgramResponse::facultateNume, String.CASE_INSENSITIVE_ORDER)
        .thenComparing(RaportInscrieriProgramResponse::programNume, String.CASE_INSENSITIVE_ORDER));
    return report;
  }

  private List<RezultatAdmitereResponse> filterByDate(
      List<RezultatAdmitereResponse> rezultate, LocalDate start, LocalDate end) {
    if (start == null && end == null) {
      return rezultate;
    }
    return rezultate.stream()
        .filter(result -> {
          LocalDate date = result.createdAt().toLocalDate();
          if (start != null && date.isBefore(start)) {
            return false;
          }
          if (end != null && date.isAfter(end)) {
            return false;
          }
          return true;
        })
        .toList();
  }

  private String toCsv(List<RaportInscrieriProgramResponse> items) {
    StringBuilder builder = new StringBuilder();
    builder.append("program_id,program,facultate,inscrisi\n");
    for (RaportInscrieriProgramResponse item : items) {
      builder.append(item.programId()).append(',')
          .append(escapeCsv(item.programNume())).append(',')
          .append(escapeCsv(item.facultateNume())).append(',')
          .append(item.inscrisi())
          .append('\n');
    }
    return builder.toString();
  }

  private String escapeCsv(String value) {
    if (value == null) {
      return "";
    }
    String sanitized = value.replace("\"", "\"\"");
    return "\"" + sanitized + "\"";
  }

  private byte[] toPdf(List<RaportInscrieriProgramResponse> items) throws IOException {
    try (PDDocument document = new PDDocument()) {
      PDPage page = new PDPage(PDRectangle.A4);
      document.addPage(page);

      PDPageContentStream content = new PDPageContentStream(document, page);
      content.setFont(PDType1Font.COURIER, 11);

      float margin = 48;
      float y = page.getMediaBox().getHeight() - margin;
      float leading = 16;

      content.beginText();
      content.newLineAtOffset(margin, y);
      content.showText("Raport inscrieri pe program");
      content.newLineAtOffset(0, -leading);
      content.showText("Program ID | Program | Facultate | Inscrisi");
      content.newLineAtOffset(0, -leading);

      for (RaportInscrieriProgramResponse item : items) {
        String line = String.format(Locale.ROOT, "%-10s | %-28s | %-24s | %d",
            item.programId(),
            trimValue(item.programNume(), 28),
            trimValue(item.facultateNume(), 24),
            item.inscrisi());
        content.showText(line);
        content.newLineAtOffset(0, -leading);
        y -= leading;
        if (y < margin + leading) {
          content.endText();
          content.close();

          page = new PDPage(PDRectangle.A4);
          document.addPage(page);
          content = new PDPageContentStream(document, page);
          content.setFont(PDType1Font.COURIER, 11);
          y = page.getMediaBox().getHeight() - margin;
          content.beginText();
          content.newLineAtOffset(margin, y);
        }
      }

      content.endText();
      content.close();

      ByteArrayOutputStream output = new ByteArrayOutputStream();
      document.save(output);
      return output.toByteArray();
    }
  }

  private String trimValue(String value, int max) {
    if (value == null) {
      return "";
    }
    if (value.length() <= max) {
      return value;
    }
    return value.substring(0, max - 3) + "...";
  }
}
